const express = require('express');
const Job = require('../models/Job');
const { auth, isAdmin } = require('../middleware/auth');
const { validateJob } = require('../middleware/validation');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    })
      .populate('postedBy', 'fullName currentCompany')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'fullName currentCompany');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user._id,
    });

    await job.save();
    await job.populate('postedBy', 'fullName currentCompany');

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job (poster only)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    Object.assign(job, req.body);
    await job.save();
    await job.populate('postedBy', 'fullName currentCompany');

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job (poster only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Manage all jobs
router.put('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('postedBy', 'fullName currentCompany');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;