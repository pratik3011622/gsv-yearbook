const mongoose = require('mongoose');

const platformStatsSchema = new mongoose.Schema({
  totalAlumni: {
    type: Number,
    default: 0,
  },
  totalCountries: {
    type: Number,
    default: 0,
  },
  totalEvents: {
    type: Number,
    default: 0,
  },
  totalJobs: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PlatformStats', platformStatsSchema);