const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true, // e.g., 'approve_profile', 'reject_photo'
  },
  targetType: {
    type: String,
    required: true, // 'profile', 'photo'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: mongoose.Schema.Types.Mixed, // Can store {'reason': '...'}
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminLog', adminLogSchema);