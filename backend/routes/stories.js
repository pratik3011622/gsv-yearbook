const express = require('express');
const Story = require('../models/Story');
const { auth, isAdmin, isAlumni } = require('../middleware/auth');
const { validateStory } = require('../middleware/validation');

const router = express.Router();

// Get all approved stories (public)
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ approvalStatus: 'approved' })
      .populate('authorId', 'fullName batchYear')
      .sort({ publishedAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured story (only the most recent one)
router.get('/featured', async (req, res) => {
  try {
    const story = await Story.findOne({ isFeatured: true, approvalStatus: 'approved' })
      .populate('authorId', 'fullName batchYear')
      .sort({ publishedAt: -1 });
    res.json(story ? [story] : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('authorId', 'fullName');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Increment view count
    story.viewsCount += 1;
    await story.save();

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create story
router.post('/', auth, async (req, res) => {
  try {
    const story = new Story({
      ...req.body,
      authorId: req.user._id,
      approvalStatus: 'approved', // Auto-approve stories from authenticated alumni
    });

    await story.save();
    await story.populate('authorId', 'fullName batchYear');

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update story (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      authorId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found or not authorized' });
    }

    Object.assign(story, req.body);
    await story.save();
    await story.populate('authorId', 'fullName');

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete story (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      authorId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found or not authorized' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Manage all stories
router.put('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('authorId', 'fullName');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Approve story
router.put('/:id/approve', auth, isAdmin, async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'approved' },
      { new: true }
    ).populate('authorId', 'fullName batchYear');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reject story
router.put('/:id/reject', auth, isAdmin, async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'rejected' },
      { new: true }
    ).populate('authorId', 'fullName batchYear');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all stories for admin (including pending)
router.get('/admin/all', auth, isAdmin, async (req, res) => {
  try {
    const stories = await Story.find({})
      .populate('authorId', 'fullName batchYear')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;