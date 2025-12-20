const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  durationMinutes: {
    type: Number,
    default: 60,
  },
  topic: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    required: true,
  },
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('MentorshipSession', mentorshipSessionSchema);