const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true, // 'reunion', 'networking'
  },
  imageUrl: String,
  maxAttendees: Number,
  rsvpCount: {
    type: Number,
    default: 0,
  },
  isPast: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);