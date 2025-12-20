const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  batchYear: Number,
  department: String,
  currentCompany: String,
  jobTitle: String,
  location: String,
  country: {
    type: String,
    default: 'India',
  },
  bio: String,
  profileImageUrl: String,
  linkedinUrl: String,
  rollNumber: String, // For verification
  isMentor: {
    type: Boolean,
    default: false,
  },
  skills: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ['student', 'alumni', 'admin'],
    default: 'alumni',
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true,
  },
  rejectionReason: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);