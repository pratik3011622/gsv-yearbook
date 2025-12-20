const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

const isAlumni = (req, res, next) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({ message: 'Access denied. Alumni only.' });
  }
  next();
};

const isAlumniOrAdmin = (req, res, next) => {
  if (req.user.role !== 'alumni' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Alumni or Admin only.' });
  }
  next();
};

module.exports = { auth, isAdmin, isAlumni, isAlumniOrAdmin };