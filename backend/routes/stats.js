const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Job = require('../models/Job');
const Story = require('../models/Story');
const Memory = require('../models/Memory');
const MentorshipSession = require('../models/MentorshipSession');
const PlatformStats = require('../models/PlatformStats');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Helper function to update platform stats
async function updatePlatformStats(stats) {
  const totalAlumni = await User.countDocuments();
  const totalCountries = await User.distinct('country');
  const totalEvents = await Event.countDocuments();
  const totalJobs = await Job.countDocuments({
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: null }
    ]
  });
  const totalStories = await Story.countDocuments();
  const totalMemories = await Memory.countDocuments();
  const totalMentorshipSessions = await MentorshipSession.countDocuments();

  stats.totalAlumni = totalAlumni;
  stats.totalCountries = totalCountries.length;
  stats.totalEvents = totalEvents;
  stats.totalJobs = totalJobs;
  stats.totalStories = totalStories;
  stats.totalMemories = totalMemories;
  stats.totalMentorshipSessions = totalMentorshipSessions;
  await stats.save();
}

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
      await updatePlatformStats(stats);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;