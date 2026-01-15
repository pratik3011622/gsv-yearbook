const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Not required for Firebase Auth users (handled by Firebase)
  },
  firebaseUid: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  googleId: {
    type: String, // Kept for legacy or specific Google ID reference if needed
    sparse: true,
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