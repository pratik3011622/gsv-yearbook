const express = require('express');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const { auth, isAdmin } = require('../middleware/auth');

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
router.put('/me', auth, async (req, res) => {
  try {
    const allowedFields = [
      'fullName', 'batchYear', 'department', 'currentCompany',
      'jobTitle', 'location', 'country', 'bio', 'profileImageUrl',
      'linkedinUrl', 'rollNumber', 'isMentor', 'skills'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

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