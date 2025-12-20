const express = require('express');
const Event = require('../models/Event');
const EventRSVP = require('../models/EventRSVP');
const { auth, isAdmin } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({})
      .populate('createdBy', 'fullName')
      .sort({ eventDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id,
    });

    await event.save();
    await event.populate('createdBy', 'fullName');

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event (creator only)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }

    Object.assign(event, req.body);
    await event.save();
    await event.populate('createdBy', 'fullName');

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete event (creator only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }

    // Delete associated RSVPs
    await EventRSVP.deleteMany({ eventId: req.params.id });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RSVP to event
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const existingRSVP = await EventRSVP.findOne({
      eventId: req.params.id,
      userId: req.user._id,
    });

    if (existingRSVP) {
      existingRSVP.status = status;
      await existingRSVP.save();
      return res.json(existingRSVP);
    }

    const rsvp = new EventRSVP({
      eventId: req.params.id,
      userId: req.user._id,
      status,
    });

    await rsvp.save();

    // Update event RSVP count
    const rsvpCount = await EventRSVP.countDocuments({
      eventId: req.params.id,
      status: 'attending',
    });

    await Event.findByIdAndUpdate(req.params.id, { rsvpCount });

    res.status(201).json(rsvp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get RSVPs for event
router.get('/:id/rsvps', async (req, res) => {
  try {
    const rsvps = await EventRSVP.find({ eventId: req.params.id })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's RSVP for event
router.get('/:id/my-rsvp', auth, async (req, res) => {
  try {
    const rsvp = await EventRSVP.findOne({
      eventId: req.params.id,
      userId: req.user._id,
    });
    res.json(rsvp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Manage all events
router.put('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'fullName');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/admin/:id', auth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete associated RSVPs
    await EventRSVP.deleteMany({ eventId: req.params.id });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;