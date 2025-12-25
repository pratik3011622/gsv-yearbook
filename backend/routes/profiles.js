const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all profiles (public)
router.get('/', async (req, res) => {
  try {
    const profiles = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get profile by ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await User.findById(req.params.id).select('-password');
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
        // Handle array fields
        if (['skills', 'pastCompanies', 'achievements', 'certifications'].includes(field)) {
          updates[field] = Array.isArray(req.body[field]) ? req.body[field] : JSON.parse(req.body[field] || '[]');
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // Handle profile photo upload
    if (req.file) {
      updates.avatarUrl = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;