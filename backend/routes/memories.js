const express = require('express');
const multer = require('multer');
const path = require('path');
const Memory = require('../models/Memory');
const PhotoUpload = require('../models/PhotoUpload');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Get all memories
router.get('/', async (req, res) => {
  try {
    const memories = await Memory.find({})
      .populate('uploadedBy', 'fullName')
      .sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get memory by ID
router.get('/:id', async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id)
      .populate('uploadedBy', 'fullName');
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create memory
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, year, eventType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const memory = new Memory({
      title,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
      year: parseInt(year),
      eventType,
      uploadedBy: req.user._id,
    });

    await memory.save();
    await memory.populate('uploadedBy', 'fullName');

    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update memory (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found or not authorized' });
    }

    const allowedFields = ['title', 'description', 'year', 'eventType'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        memory[field] = req.body[field];
      }
    });

    await memory.save();
    await memory.populate('uploadedBy', 'fullName');

    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete memory (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found or not authorized' });
    }

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload photo for moderation
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const photoUpload = new PhotoUpload({
      uploaderId: req.user._id,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await photoUpload.save();
    res.status(201).json(photoUpload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get pending photo uploads
router.get('/admin/pending', auth, isAdmin, async (req, res) => {
  try {
    const uploads = await PhotoUpload.find({ status: 'pending' })
      .populate('uploaderId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Approve photo upload
router.put('/admin/approve/:id', auth, isAdmin, async (req, res) => {
  try {
    const upload = await PhotoUpload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

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

    res.json({ message: 'Photo approved and memory created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reject photo upload
router.put('/admin/reject/:id', auth, isAdmin, async (req, res) => {
  try {
    const { notes } = req.body;
    const upload = await PhotoUpload.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        moderationNotes: notes,
        moderatedBy: req.user._id,
        moderatedAt: new Date(),
      },
      { new: true }
    );

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    res.json(upload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete memory
router.delete('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Memory deleted successfully' });
  }
});

module.exports = router;