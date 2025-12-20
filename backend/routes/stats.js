const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Job = require('../models/Job');
const PlatformStats = require('../models/PlatformStats');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get platform statistics
router.get('/', async (req, res) => {
  try {
    // Get or create stats record
    let stats = await PlatformStats.findOne();
    if (!stats) {
      stats = new PlatformStats();
      await stats.save();
    }

    // Update stats if they're old (more than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (stats.updatedAt < oneHourAgo) {
      const totalAlumni = await User.countDocuments({ approvalStatus: 'approved' });
      const totalCountries = await User.distinct('country', { approvalStatus: 'approved' });
      const totalEvents = await Event.countDocuments();
      const totalJobs = await Job.countDocuments({
        $or: [
          { expiresAt: { $gt: new Date() } },
          { expiresAt: null }
        ]
      });

      stats.totalAlumni = totalAlumni;
      stats.totalCountries = totalCountries.length;
      stats.totalEvents = totalEvents;
      stats.totalJobs = totalJobs;
      await stats.save();
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Manually update stats
router.post('/update', auth, isAdmin, async (req, res) => {
  try {
    const totalAlumni = await User.countDocuments({ approvalStatus: 'approved' });
    const totalCountries = await User.distinct('country', { approvalStatus: 'approved' });
    const totalEvents = await Event.countDocuments();
    const totalJobs = await Job.countDocuments({
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    });

    let stats = await PlatformStats.findOne();
    if (!stats) {
      stats = new PlatformStats();
    }

    stats.totalAlumni = totalAlumni;
    stats.totalCountries = totalCountries.length;
    stats.totalEvents = totalEvents;
    stats.totalJobs = totalJobs;
    await stats.save();

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;