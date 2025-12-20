const express = require('express');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const PhotoUpload = require('../models/PhotoUpload');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ approvalStatus: 'approved' });
    const pendingUsers = await User.countDocuments({ approvalStatus: 'pending' });
    const rejectedUsers = await User.countDocuments({ approvalStatus: 'rejected' });

    const pendingPhotos = await PhotoUpload.countDocuments({ status: 'pending' });

    const recentLogs = await AdminLog.find({})
      .populate('adminId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      users: {
        total: totalUsers,
        approved: approvedUsers,
        pending: pendingUsers,
        rejected: rejectedUsers,
      },
      pendingPhotos,
      recentActivity: recentLogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all admin logs
router.get('/logs', auth, isAdmin, async (req, res) => {
  try {
    const logs = await AdminLog.find({})
      .populate('adminId', 'fullName')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk approve users
router.post('/users/bulk-approve', auth, isAdmin, async (req, res) => {
  try {
    const { userIds } = req.body;

    const result = await User.updateMany(
      { _id: { $in: userIds }, approvalStatus: 'pending' },
      {
        approvalStatus: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date(),
        rejectionReason: null,
      }
    );

    // Log bulk action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'bulk_approve_profiles',
      targetType: 'profile',
      targetId: null,
      details: { count: result.modifiedCount, userIds },
    });

    res.json({ message: `${result.modifiedCount} users approved` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk reject users
router.post('/users/bulk-reject', auth, isAdmin, async (req, res) => {
  try {
    const { userIds, reason } = req.body;

    const result = await User.updateMany(
      { _id: { $in: userIds }, approvalStatus: 'pending' },
      {
        approvalStatus: 'rejected',
        rejectionReason: reason,
        approvedBy: req.user._id,
        approvedAt: new Date(),
      }
    );

    // Log bulk action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'bulk_reject_profiles',
      targetType: 'profile',
      targetId: null,
      details: { count: result.modifiedCount, userIds, reason },
    });

    res.json({ message: `${result.modifiedCount} users rejected` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending photo uploads
router.get('/photos/pending', auth, isAdmin, async (req, res) => {
  try {
    const uploads = await PhotoUpload.find({ status: 'pending' })
      .populate('uploaderId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk approve photos
router.post('/photos/bulk-approve', auth, isAdmin, async (req, res) => {
  try {
    const { uploadIds } = req.body;

    const uploads = await PhotoUpload.find({ _id: { $in: uploadIds }, status: 'pending' });

    for (const upload of uploads) {
      upload.status = 'approved';
      upload.moderatedBy = req.user._id;
      upload.moderatedAt = new Date();
      await upload.save();

      // Create memory from approved photo
      const Memory = require('../models/Memory');
      await Memory.create({
        title: 'Untitled Memory',
        imageUrl: upload.fileUrl,
        year: new Date().getFullYear(),
        eventType: 'user_upload',
        uploadedBy: upload.uploaderId,
      });
    }

    // Log bulk action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'bulk_approve_photos',
      targetType: 'photo',
      targetId: null,
      details: { count: uploads.length, uploadIds },
    });

    res.json({ message: `${uploads.length} photos approved` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk reject photos
router.post('/photos/bulk-reject', auth, isAdmin, async (req, res) => {
  try {
    const { uploadIds, notes } = req.body;

    const result = await PhotoUpload.updateMany(
      { _id: { $in: uploadIds }, status: 'pending' },
      {
        status: 'rejected',
        moderationNotes: notes,
        moderatedBy: req.user._id,
        moderatedAt: new Date(),
      }
    );

    // Log bulk action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'bulk_reject_photos',
      targetType: 'photo',
      targetId: null,
      details: { count: result.modifiedCount, uploadIds, notes },
    });

    res.json({ message: `${result.modifiedCount} photos rejected` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;