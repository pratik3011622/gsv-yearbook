const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const admin = require('../config/firebase');

// Configure Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary environment variables not set!');
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured successfully');
}

// Configure multer for Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gsv-yearbook/profiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face' },
      { quality: 'auto' }
    ]
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = express.Router();

// Get all profiles (authenticated users only) - only verified users
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    // Filter to only include users with verified emails
    const verifiedProfiles = [];
    for (const profile of profiles) {
      try {
        if (profile.firebaseUid) {
          const firebaseUser = await admin.auth().getUser(profile.firebaseUid);
          if (firebaseUser.emailVerified) {
            verifiedProfiles.push(profile);
          }
        }
      } catch (error) {
        console.error(`Error checking verification for user ${profile.firebaseUid}:`, error.message);
        // Skip users that can't be verified
      }
    }

    res.json(verifiedProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get profile by ID
router.get('/:id', async (req, res) => {
  try {
    // Try to find by Mongo ID first, then fallback to firebaseUid
    let profile = await User.findById(req.params.id).select('-password');
    if (!profile) {
      profile = await User.findOne({ firebaseUid: req.params.id }).select('-password');
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get own profile
router.get('/me/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Update own profile
router.put('/me', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('Profile update request received for UID:', req.user.firebaseUid);

    // 1. Prepare Updates Object
    const allowedFields = [
      'fullName', 'batchYear', 'department', 'company',
      'jobTitle', 'location', 'country', 'bio', 'avatarUrl',
      'linkedinUrl', 'rollNumber', 'isMentor', 'skills',
      'tagline', 'universityName', 'degree', 'specialization',
      'graduationStart', 'graduationEnd', 'currentCompany',
      'industry', 'yearsOfExperience', 'pastCompanies',
      'githubUrl', 'websiteUrl', 'achievements', 'certifications',
      'isProfilePublic'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['skills', 'pastCompanies', 'achievements', 'certifications'].includes(field)) {
          updates[field] = Array.isArray(req.body[field]) ? req.body[field] : JSON.parse(req.body[field] || '[]');
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      updates.avatarUrl = req.file.path;
    }

    // 2. Resolve User (Robust Lookup)
    // First try by firebaseUid
    let user = await User.findOne({ firebaseUid: req.user.firebaseUid });

    // If not found, try by email (to link existing disparate accounts)
    if (!user && req.user.email) {
      console.log(`User not found by UID ${req.user.firebaseUid}, trying email ${req.user.email}...`);
      user = await User.findOne({ email: req.user.email });

      if (user) {
        console.log(`Found existing user by email. Linking UID: ${req.user.firebaseUid}`);
        user.firebaseUid = req.user.firebaseUid; // Link the UID!
        // Don't save yet, we'll do it in the update step
      }
    }

    // 3. Execute Update or Create
    if (user) {
      // Update existing user
      // We manually merge updates to ensure we handle the document directly
      Object.keys(updates).forEach(key => {
        user[key] = updates[key];
      });
      // Ensure UID is set (in case we found by email)
      user.firebaseUid = req.user.firebaseUid;

      await user.save();
      console.log('Profile updated successfully for:', user.email);
    } else {
      // Create NEW user
      console.log('Creating new user for:', req.user.email);
      user = new User({
        ...updates,
        email: req.user.email,
        firebaseUid: req.user.firebaseUid,
        role: 'student' // Default role
      });
      await user.save();
      console.log('New profile created successfully.');
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    // Return a clearer error message
    res.status(500).json({ message: `Update failed: ${error.message}` });
  }
});


module.exports = router;