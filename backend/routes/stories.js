const express = require('express');
const mongoose = require('mongoose');
const Story = require('../models/Story');
const { auth, isAlumni } = require('../middleware/auth');
const { validateStory } = require('../middleware/validation');

const router = express.Router();

// Get all stories (public)
router.get('/', async (req, res) => {
  try {
    const stories = await Story.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: 'firebaseUid',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          title: 1,
          content: 1,
          excerpt: 1,
          coverImageUrl: 1,
          highlightQuote: 1,
          readTime: 1,
          tags: 1,
          isFeatured: 1,
          approvalStatus: 1,
          viewsCount: 1,
          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: 1, // Include authorId to check ownership
          author: {
            fullName: '$author.fullName',
            batchYear: '$author.batchYear'
          }
        }
      },
      {
        $sort: { publishedAt: -1 }
      }
    ]);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured story (only the most recent one)
router.get('/featured', async (req, res) => {
  try {
    const stories = await Story.aggregate([
      { $match: { isFeatured: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: 'firebaseUid',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          title: 1,
          content: 1,
          excerpt: 1,
          coverImageUrl: 1,
          highlightQuote: 1,
          readTime: 1,
          tags: 1,
          isFeatured: 1,
          approvalStatus: 1,
          viewsCount: 1,
          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: 1,
          author: {
            fullName: '$author.fullName',
            batchYear: '$author.batchYear'
          }
        }
      },
      {
        $sort: { publishedAt: -1 }
      },
      { $limit: 1 }
    ]);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get story by ID
router.get('/:id', async (req, res) => {
  try {
    const stories = await Story.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: 'firebaseUid',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          title: 1,
          content: 1,
          excerpt: 1,
          coverImageUrl: 1,
          highlightQuote: 1,
          readTime: 1,
          tags: 1,
          isFeatured: 1,
          approvalStatus: 1,
          viewsCount: 1,
          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: 1,
          author: {
            fullName: '$author.fullName',
            batchYear: '$author.batchYear',
            company: '$author.company'
          }
        }
      }
    ]);

    if (stories.length === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const story = stories[0];

    // Increment view count
    await Story.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create story
router.post('/', auth, validateStory, async (req, res) => {
  try {
    const story = new Story({
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt,
      coverImageUrl: req.body.coverImageUrl,
      highlightQuote: req.body.highlightQuote,
      readTime: req.body.readTime,
      tags: req.body.tags,
      authorId: req.user.firebaseUid, // Use Firebase UID as string
      approvalStatus: 'approved', // Auto-approve stories from authenticated alumni
    });

    await story.save();

    // Populate author info for response
    const populatedStory = await Story.aggregate([
      { $match: { _id: story._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: 'firebaseUid',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          title: 1,
          content: 1,
          excerpt: 1,
          coverImageUrl: 1,
          highlightQuote: 1,
          readTime: 1,
          tags: 1,
          isFeatured: 1,
          approvalStatus: 1,
          viewsCount: 1,
          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: 1,
          author: {
            fullName: '$author.fullName',
            batchYear: '$author.batchYear'
          }
        }
      }
    ]);

    res.status(201).json(populatedStory[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update story (author only)
router.put('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      authorId: req.user.firebaseUid, // Match by Firebase UID string
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found or not authorized' });
    }

    // Update allowed fields
    story.title = req.body.title || story.title;
    story.content = req.body.content || story.content;
    story.excerpt = req.body.excerpt || story.excerpt;
    story.coverImageUrl = req.body.coverImageUrl || story.coverImageUrl;
    story.highlightQuote = req.body.highlightQuote || story.highlightQuote;
    story.readTime = req.body.readTime || story.readTime;
    story.tags = req.body.tags || story.tags;

    await story.save();

    // Populate author info for response
    const populatedStory = await Story.aggregate([
      { $match: { _id: story._id } },
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: 'firebaseUid',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          title: 1,
          content: 1,
          excerpt: 1,
          coverImageUrl: 1,
          highlightQuote: 1,
          readTime: 1,
          tags: 1,
          isFeatured: 1,
          approvalStatus: 1,
          viewsCount: 1,
          publishedAt: 1,
          createdAt: 1,
          updatedAt: 1,
          authorId: 1,
          author: {
            fullName: '$author.fullName'
          }
        }
      }
    ]);

    res.json(populatedStory[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete story (author only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      authorId: req.user.firebaseUid, // Match by Firebase UID string
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found or not authorized' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;