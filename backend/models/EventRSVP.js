const mongoose = require('mongoose');

const eventRSVPSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['attending', 'maybe', 'declined'],
    required: true,
  },
}, {
  timestamps: true,
});

eventRSVPSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('EventRSVP', eventRSVPSchema);