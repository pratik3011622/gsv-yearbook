const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const { validateRegistration } = require('../middleware/validation');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { email, password, fullName, ...otherFields } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, password, and full name are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      ...otherFields,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_change_this', {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_change_this', {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      // Add other fields as needed
    },
  });
});

module.exports = router;