const express = require('express');
const User = require('../models/User'); // Kept if we want to sync optionally, but we'll try/catch around it
const { auth, verifyFirebase } = require('../middleware/auth');
const admin = require('../config/firebase');

const router = express.Router();

// Register/Sync User - Optional now if we trust token, but good for directory
router.post('/register', verifyFirebase, async (req, res) => {
  try {
    // If MongoDB is down, we shouldn't fail the request if auth is satisfied
    const { email, fullName, role, ...otherFields } = req.body;
    const { uid: firebaseUid } = req.firebaseUser;

    try {
      // Try to sync to Mongo if available
      let existingUser = await User.findOne({ firebaseUid });
      if (!existingUser) {
        // Check by email before creating to avoid duplicates
        existingUser = await User.findOne({ email });

        if (existingUser) {
          console.log(`User ${email} found by email during register. Linking UID and Updating Profile: ${firebaseUid}`);
          existingUser.firebaseUid = firebaseUid;

          // FIX: Force update of profile fields on re-registration/linking
          existingUser.fullName = fullName;
          existingUser.role = role; // Update role to match new registration

          // Assign other fields like batchYear, company, etc.
          Object.assign(existingUser, otherFields);

          await existingUser.save();
        } else {
          const user = new User({
            email,
            fullName,
            firebaseUid,
            role: role || 'student',
            ...otherFields,
          });
          await user.save();
          console.log(`Synced new user ${email} to MongoDB with UID: ${firebaseUid}`);
        }
      } else {
        console.log(`User ${email} already exists in MongoDB during register. UID: ${firebaseUid}`);
        // Optional: Update details here too if we want registration to be "upsert" always
      }
    } catch (dbError) {
      console.warn("MongoDB sync failed during register (non-fatal):", dbError.message);
      // If validation fails (e.g. data mismatch), we should probably let frontend know?
      // Re-throwing allows AuthContext to alert the user
      throw dbError;
    }

    // Return success based on valid token
    res.status(201).json({
      user: {
        id: firebaseUid,
        email: email,
        fullName: fullName,
        role: role || 'student',
        firebaseUid: firebaseUid,
        isTokenUser: true
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Send specifically if it was a validation error from Mongo
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Google Sign-In / Sync
router.post('/google', verifyFirebase, async (req, res) => {
  try {
    const { uid: firebaseUid, name, picture, email } = req.firebaseUser;

    try {
      // Optional Sync
      let user = await User.findOne({ firebaseUid });
      if (!user && email) {
        user = await User.findOne({ email });
      }

      if (user) {
        if (!user.firebaseUid) {
          user.firebaseUid = firebaseUid;
          await user.save();
        }
      } else {
        // Create new
        user = new User({
          email: email,
          fullName: name || 'User',
          firebaseUid,
          avatarUrl: picture,
          role: 'student',
        });
        await user.save();
      }
    } catch (dbError) {
      console.warn("MongoDB sync failed during google auth (non-fatal):", dbError.message);
    }

    res.json({
      user: {
        id: firebaseUid,
        email: email,
        fullName: name,
        role: 'student', // Default, real role would need DB or custom claims
        avatarUrl: picture,
        firebaseUid: firebaseUid
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Login - Deprecated/Unused
router.post('/login', (req, res) => {
  res.status(404).json({ message: 'Use Firebase Auth on client side' });
});

// Get current user (Read) - Auto-creates if missing
router.get('/me', auth, async (req, res) => {
  try {
    const { firebaseUid, email, fullName, picture } = req.user;
    console.log(`[GET /me] Looking up user with UID: ${firebaseUid}`);

    // Try to find user
    let user = await User.findOne({ firebaseUid });

    // If user missing, auto-create (or link) using token data (Self-Healing)
    if (!user) {
      console.warn(`[GET /me] User NOT found for UID: ${firebaseUid}. Checking by email...`);

      try {
        // Check by email first to avoid duplicate
        if (email) {
          user = await User.findOne({ email });
        }

        if (user) {
          console.log(`[GET /me] Found user by email ${email}. Linking UID...`);
          user.firebaseUid = firebaseUid;
          await user.save();
        } else {
          console.log(`[GET /me] User not found by email. Creating new...`);
          user = new User({
            email,
            firebaseUid,
            fullName: fullName || 'User',
            avatarUrl: picture,
            role: 'student'
          });
          await user.save();
          console.log(`[GET /me] User auto-created successfully.`);
        }
      } catch (createError) {
        console.error(`[GET /me] Failed to auto-create user: ${createError.message}`);
        // Fallback to minimal token data if DB fails
        return res.json({
          user: {
            id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName,
            role: req.user.role,
            avatarUrl: req.user.picture,
            ...req.user
          }
        });
      }
    }

    if (user) {
      console.log(`[GET /me] Returning user from DB: ${user.fullName}`);
      res.json({ user });
    }

  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete current user (Delete)
router.delete('/me', auth, async (req, res) => {
  try {
    const { firebaseUid } = req.user;

    // 1. Delete from MongoDB
    const result = await User.findOneAndDelete({ firebaseUid });

    // 2. Delete from Firebase Auth
    try {
      await admin.auth().deleteUser(firebaseUid);
      console.log(`Deleted Firebase user: ${firebaseUid}`);
    } catch (firebaseError) {
      console.error('Error deleting user from Firebase:', firebaseError);
      // We continue even if Firebase fails, as the "profile" is gone.
    }

    if (!result) {
      // Even if Mongo record was missing, if we deleted from Firebase, it's a success
      return res.json({ message: 'User account deleted (Mongo record was missing)' });
    }
    res.json({ message: 'User account fully deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;