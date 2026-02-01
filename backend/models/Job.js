const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  applyUrl: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String,
    required: false,
  },
  postedBy: {
    type: String,
    required: true,
    index: true, // For efficient queries
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  expiresAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Job', jobSchema);