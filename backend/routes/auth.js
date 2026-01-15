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

    console.log('Checking for existing user with email:', email);
    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log('Existing user found:', !!existingUser);
    if (existingUser) {
      console.log('User already exists, returning error');
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
    console.log('Login request for email:', req.body.email);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Finding user in database...');
    const user = await User.findOne({ email });
    console.log('User found:', !!user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Generating token...');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_change_this', {
      expiresIn: '7d',
    });
    console.log('Token generated successfully');

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
    console.error('Error stack:', error.stack);
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