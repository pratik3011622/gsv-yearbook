const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Job = require('../models/Job');
const Story = require('../models/Story');
const Memory = require('../models/Memory');
const MentorshipSession = require('../models/MentorshipSession');
const PlatformStats = require('../models/PlatformStats');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper function to update platform stats
async function updatePlatformStats(stats) {
  const totalAlumni = await User.countDocuments({ approvalStatus: 'approved' });
  const totalCountries = await User.distinct('country', { approvalStatus: 'approved' });
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

// Advanced analytics for admin dashboard
router.get('/advanced', auth, isAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // User analytics
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ approvalStatus: 'approved' });
    const pendingUsers = await User.countDocuments({ approvalStatus: 'pending' });
    const rejectedUsers = await User.countDocuments({ approvalStatus: 'rejected' });

    // User growth over time (last 30 days)
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Geographical distribution
    const countryDistribution = await User.aggregate([
      { $match: { approvalStatus: 'approved', country: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Department distribution
    const departmentDistribution = await User.aggregate([
      { $match: { approvalStatus: 'approved', department: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Batch year distribution
    const batchYearDistribution = await User.aggregate([
      { $match: { approvalStatus: 'approved', batchYear: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$batchYear',
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': -1 } }
    ]);

    // Content analytics
    const totalStories = await Story.countDocuments();
    const totalMemories = await Memory.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalEvents = await Event.countDocuments();

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentStories = await Story.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentMemories = await Memory.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentJobs = await Job.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentEvents = await Event.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Mentorship analytics
    const totalMentorshipSessions = await MentorshipSession.countDocuments();
    const activeMentorshipSessions = await MentorshipSession.countDocuments({
      status: { $in: ['pending', 'confirmed'] }
    });
    const completedMentorshipSessions = await MentorshipSession.countDocuments({
      status: 'completed'
    });

    // Top skills
    const topSkills = await User.aggregate([
      { $match: { approvalStatus: 'approved', skills: { $exists: true, $ne: [] } } },
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Job type distribution
    const jobTypeDistribution = await Job.aggregate([
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Event categories
    const eventCategories = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const analytics = {
      users: {
        total: totalUsers,
        approved: approvedUsers,
        pending: pendingUsers,
        rejected: rejectedUsers,
        growth: userGrowth,
        countries: countryDistribution,
        departments: departmentDistribution,
        batchYears: batchYearDistribution,
        topSkills: topSkills
      },
      content: {
        stories: totalStories,
        memories: totalMemories,
        jobs: totalJobs,
        events: totalEvents,
        recentActivity: {
          stories: recentStories,
          memories: recentMemories,
          jobs: recentJobs,
          events: recentEvents
        },
        jobTypes: jobTypeDistribution,
        eventCategories: eventCategories
      },
      mentorship: {
        totalSessions: totalMentorshipSessions,
        activeSessions: activeMentorshipSessions,
        completedSessions: completedMentorshipSessions
      },
      engagement: {
        averageStoriesPerUser: totalStories / Math.max(approvedUsers, 1),
        averageMemoriesPerUser: totalMemories / Math.max(approvedUsers, 1),
        averageJobsPerUser: totalJobs / Math.max(approvedUsers, 1)
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User engagement analytics
router.get('/engagement', auth, isAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Daily active users (users who logged in recently)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    // Content creation activity
    const contentActivity = await Promise.all([
      Story.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Memory.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Job.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    // Top contributors
    const topContributors = await User.aggregate([
      {
        $lookup: {
          from: 'stories',
          localField: '_id',
          foreignField: 'authorId',
          as: 'stories'
        }
      },
      {
        $lookup: {
          from: 'memories',
          localField: '_id',
          foreignField: 'uploadedBy',
          as: 'memories'
        }
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'postedBy',
          as: 'jobs'
        }
      },
      {
        $addFields: {
          totalContributions: {
            $add: [
              { $size: '$stories' },
              { $size: '$memories' },
              { $size: '$jobs' }
            ]
          }
        }
      },
      { $match: { approvalStatus: 'approved', totalContributions: { $gt: 0 } } },
      { $sort: { totalContributions: -1 } },
      { $limit: 10 },
      {
        $project: {
          fullName: 1,
          totalContributions: 1,
          storiesCount: { $size: '$stories' },
          memoriesCount: { $size: '$memories' },
          jobsCount: { $size: '$jobs' }
        }
      }
    ]);

    res.json({
      activeUsers,
      contentActivity: {
        stories: contentActivity[0],
        memories: contentActivity[1],
        jobs: contentActivity[2]
      },
      topContributors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Manually update stats
router.post('/update', auth, isAdmin, async (req, res) => {
  try {
    let stats = await PlatformStats.findOne();
    if (!stats) {
      stats = new PlatformStats();
    }

    await updatePlatformStats(stats);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;