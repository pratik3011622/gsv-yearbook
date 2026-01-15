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
  company: String,
  jobTitle: String,
  location: String,
  country: {
    type: String,
    default: 'India',
  },
  bio: String,
  avatarUrl: String,
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
    enum: ['guest', 'student', 'alumni'],
    default: 'alumni',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);