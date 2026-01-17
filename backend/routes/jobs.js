const express = require('express');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const { auth, isAlumni } = require('../middleware/auth');
const { validateJob } = require('../middleware/validation');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $match: {
          $or: [
            { expiresAt: { $gt: new Date() } },
            { expiresAt: null }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: 'firebaseUid',
          as: 'poster'
        }
      },
      {
        $unwind: '$poster'
      },
      {
        $project: {
          title: 1,
          company: 1,
          description: 1,
          location: 1,
          jobType: 1,
          domain: 1,
          skillsRequired: 1,
          applyUrl: 1,
          salaryRange: 1,
          isFeatured: 1,
          expiresAt: 1,
          createdAt: 1,
          updatedAt: 1,
          poster: {
            fullName: '$poster.fullName',
            company: '$poster.company',
            batchYear: '$poster.batchYear'
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: 'firebaseUid',
          as: 'poster'
        }
      },
      {
        $unwind: '$poster'
      },
      {
        $project: {
          title: 1,
          company: 1,
          description: 1,
          location: 1,
          jobType: 1,
          domain: 1,
          skillsRequired: 1,
          applyUrl: 1,
          salaryRange: 1,
          isFeatured: 1,
          expiresAt: 1,
          createdAt: 1,
          updatedAt: 1,
          poster: {
            fullName: '$poster.fullName',
            company: '$poster.company',
            batchYear: '$poster.batchYear'
          }
        }
      }
    ]);

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(jobs[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job
router.post('/', auth, validateJob, async (req, res) => {
  try {
    const job = new Job({
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      location: req.body.location,
      jobType: req.body.jobType,
      domain: req.body.domain,
      skillsRequired: req.body.skillsRequired,
      applyUrl: req.body.applyUrl,
      salaryRange: req.body.salaryRange,
      expiresAt: req.body.expiresAt,
      postedBy: req.user.firebaseUid, // Use Firebase UID as string
    });

    await job.save();

    // Populate poster info for response
    const populatedJob = await Job.aggregate([
      { $match: { _id: job._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: 'firebaseUid',
          as: 'poster'
        }
      },
      {
        $unwind: '$poster'
      },
      {
        $project: {
          title: 1,
          company: 1,
          description: 1,
          location: 1,
          jobType: 1,
          domain: 1,
          skillsRequired: 1,
          applyUrl: 1,
          salaryRange: 1,
          isFeatured: 1,
          expiresAt: 1,
          createdAt: 1,
          updatedAt: 1,
          poster: {
            fullName: '$poster.fullName',
            company: '$poster.company'
          }
        }
      }
    ]);

    res.status(201).json(populatedJob[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job (poster only)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user.firebaseUid, // Match by Firebase UID string
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    // Update allowed fields
    job.title = req.body.title || job.title;
    job.company = req.body.company || job.company;
    job.description = req.body.description || job.description;
    job.location = req.body.location || job.location;
    job.jobType = req.body.jobType || job.jobType;
    job.domain = req.body.domain || job.domain;
    job.skillsRequired = req.body.skillsRequired || job.skillsRequired;
    job.applyUrl = req.body.applyUrl || job.applyUrl;
    job.salaryRange = req.body.salaryRange || job.salaryRange;
    job.expiresAt = req.body.expiresAt || job.expiresAt;

    await job.save();

    // Populate poster info for response
    const populatedJob = await Job.aggregate([
      { $match: { _id: job._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: 'firebaseUid',
          as: 'poster'
        }
      },
      {
        $unwind: '$poster'
      },
      {
        $project: {
          title: 1,
          company: 1,
          description: 1,
          location: 1,
          jobType: 1,
          domain: 1,
          skillsRequired: 1,
          applyUrl: 1,
          salaryRange: 1,
          isFeatured: 1,
          expiresAt: 1,
          createdAt: 1,
          updatedAt: 1,
          poster: {
            fullName: '$poster.fullName',
            company: '$poster.company',
            batchYear: '$poster.batchYear'
          }
        }
      }
    ]);

    res.json(populatedJob[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job (poster only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user.firebaseUid, // Match by Firebase UID string
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;