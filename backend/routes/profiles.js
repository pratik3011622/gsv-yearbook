const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const { auth, isAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');

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

// Get all approved profiles (public)
router.get('/', async (req, res) => {
  try {
    const profiles = await User.find({ approvalStatus: 'approved' })
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

// Admin: Get all profiles (including pending)
router.get('/admin/all', auth, isAdmin, async (req, res) => {
  try {
    const profiles = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Approve profile
router.put('/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date(),
        rejectionReason: null,
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'approve_profile',
      targetType: 'profile',
      targetId: user._id,
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the approval if email fails
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reject profile
router.put('/:id/reject', auth, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'rejected',
        rejectionReason: reason,
        approvedBy: req.user._id,
        approvedAt: new Date(),
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'reject_profile',
      targetType: 'profile',
      targetId: user._id,
      details: { reason },
    });

    // Send rejection email
    try {
      await emailService.sendRejectionEmail(user, reason);
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the rejection if email fails
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update any profile
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;