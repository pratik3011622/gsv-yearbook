const express = require('express');
const MentorshipSession = require('../models/MentorshipSession');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's mentorship sessions
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await MentorshipSession.find({
      $or: [
        { mentorId: req.user._id },
        { menteeId: req.user._id }
      ]
    })
      .populate('mentorId', 'fullName currentCompany jobTitle')
      .populate('menteeId', 'fullName batchYear department')
      .sort({ sessionDate: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get session by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await MentorshipSession.findOne({
      _id: req.params.id,
      $or: [
        { mentorId: req.user._id },
        { menteeId: req.user._id }
      ]
    })
      .populate('mentorId', 'fullName currentCompany jobTitle')
      .populate('menteeId', 'fullName batchYear department');

    if (!session) {
      return res.status(404).json({ message: 'Session not found or not authorized' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create mentorship request (mentee only)
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, sessionDate, durationMinutes, topic } = req.body;

    const session = new MentorshipSession({
      mentorId,
      menteeId: req.user._id,
      sessionDate,
      durationMinutes,
      topic,
      status: 'pending',
    });

    await session.save();
    await session.populate('mentorId', 'fullName currentCompany jobTitle');
    await session.populate('menteeId', 'fullName batchYear department');

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update session (mentor/mentee)
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await MentorshipSession.findOne({
      _id: req.params.id,
      $or: [
        { mentorId: req.user._id },
        { menteeId: req.user._id }
      ]
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found or not authorized' });
    }

    // Only allow certain status transitions
    const allowedStatuses = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };

    if (req.body.status && !allowedStatuses[session.status].includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    Object.assign(session, req.body);
    await session.save();
    await session.populate('mentorId', 'fullName currentCompany jobTitle');
    await session.populate('menteeId', 'fullName batchYear department');

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available mentors
router.get('/mentors/available', async (req, res) => {
  try {
    const mentors = await require('../models/User').find({
      isMentor: true,
      approvalStatus: 'approved'
    })
      .select('fullName currentCompany jobTitle skills bio')
      .sort({ fullName: 1 });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;