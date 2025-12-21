const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, ...otherFields } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password (simplified for testing)
    const hashedPassword = password; // TODO: Use proper hashing

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      ...otherFields,
      // Force email verification for testing (remove this line for production)
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    // Send verification email (always send for testing)
    console.log('🔄 Attempting to send verification email for user:', user.email);
    try {
      await emailService.sendVerificationEmail(user, verificationToken);
      console.log('✅ Verification email process completed for:', user.email);
    } catch (emailError) {
      console.error('❌ Error sending verification email:', emailError);
      // Don't fail registration if email fails, but log it
    }

    // Always log verification details for testing
    console.log('📧 VERIFICATION DETAILS:');
    console.log('To:', user.email);
    console.log('Verification Token:', verificationToken);
    console.log('Verification URL:', `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`);
    console.log('Expires:', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = password === user.password; // TODO: Use proper comparison
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        message: 'Please verify your email address before logging in.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Check if user is approved
    if (user.approvalStatus !== 'approved') {
      return res.status(403).json({ message: 'Your account is pending approval. Please wait for admin approval.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      approvalStatus: req.user.approvalStatus,
      emailVerified: req.user.emailVerified,
      // Add other fields as needed
    },
  });
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update user
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.approvalStatus = 'approved'; // Auto-approve after email verification
    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    res.json({
      message: 'Email verified successfully! Your account is now active.',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;