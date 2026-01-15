const admin = require('../config/firebase');


const verifyFirebase = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    // Map Firebase token to req.user structure to maintain compatibility
    req.user = {
      _id: decodedToken.uid, // Use UID as ID
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      fullName: decodedToken.name || 'User',
      picture: decodedToken.picture,
      role: decodedToken.role || 'student', // Default or custom claim
      // Add a flag to indicate this is a token-only user
      isTokenUser: true
    };

    // Also set req.firebaseUser for backward compatibility if needed
    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const isAlumni = (req, res, next) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({ message: 'Access denied. Alumni only.' });
  }
  next();
};

module.exports = { auth, verifyFirebase, isAlumni };