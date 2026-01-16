const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

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

// Test Cloudinary configuration (for debugging)
router.get('/test-cloudinary', (req, res) => {
  const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME;
  const hasApiKey = !!process.env.CLOUDINARY_API_KEY;
  const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET;

  console.log('Cloudinary test endpoint called');
  console.log('CLOUDINARY_CLOUD_NAME present:', hasCloudName);
  console.log('CLOUDINARY_API_KEY present:', hasApiKey);
  console.log('CLOUDINARY_API_SECRET present:', hasApiSecret);

  res.json({
    cloudinaryConfigured: hasCloudName && hasApiKey && hasApiSecret,
    cloudName: hasCloudName ? 'Set' : 'Missing',
    apiKey: hasApiKey ? 'Set' : 'Missing',
    apiSecret: hasApiSecret ? 'Set' : 'Missing'
  });
});

// Get all profiles (authenticated users only)
router.get('/', auth, async (req, res) => {
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
    console.log('Profile update request received');
    console.log('File present:', !!req.file);
    if (req.file) {
      console.log('File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      });
    }
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
      console.log('File uploaded to Cloudinary:', req.file.path);
      updates.avatarUrl = req.file.path; // Cloudinary URL
      console.log('Avatar URL set:', updates.avatarUrl);
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.firebaseUid },
      updates,
      { new: true, upsert: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;