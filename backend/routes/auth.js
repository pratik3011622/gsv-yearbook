const express = require('express');
const User = require('../models/User'); // Kept if we want to sync optionally, but we'll try/catch around it
const { auth, verifyFirebase } = require('../middleware/auth');

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
        const user = new User({
          email,
          fullName,
          firebaseUid,
          role: role || 'student',
          ...otherFields,
        });
        await user.save();
        await user.save();
        console.log(`Synced new user ${email} to MongoDB with UID: ${firebaseUid}`);
      } else {
        console.log(`User ${email} already exists in MongoDB during register. UID: ${firebaseUid}`);
      }
    } catch (dbError) {
      console.warn("MongoDB sync failed during register (non-fatal):", dbError.message);
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

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const { firebaseUid } = req.user;
    console.log(`[GET /me] Looking up user with UID: ${firebaseUid}`);

    const user = await User.findOne({ firebaseUid });

    if (user) {
      console.log(`[GET /me] Found user in DB: ${user.fullName}`);
      res.json({ user });
    } else {
      console.warn(`[GET /me] User NOT found in DB for UID: ${firebaseUid}. Falling back to token data.`);
      res.json({
        user: {
          id: req.user._id,
          email: req.user.email,
          fullName: req.user.fullName,
          role: req.user.role,
          avatarUrl: req.user.picture,
          ...req.user
        },
      });
    }
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;