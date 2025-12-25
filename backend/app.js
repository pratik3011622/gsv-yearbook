const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with improved configuration and fallback
const connectDB = async () => {
  try {
    // Try Atlas connection first
    const atlasUri = process.env.MONGODB_URI;
    if (atlasUri) {
      console.log('Attempting to connect to MongoDB Atlas...');
      const conn = await mongoose.connect(atlasUri, {
        serverSelectionTimeoutMS: 10000, // 10 second timeout
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    }
  } catch (atlasError) {
    console.error('❌ MongoDB Atlas connection failed:', atlasError.message);
  }

  // Fallback to local MongoDB
  try {
    const localUri = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/yearbook';
    console.log('Attempting to connect to local MongoDB...');
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
  } catch (localError) {
    console.error('❌ Local MongoDB connection failed:', localError.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

// Add middleware to handle database operations with timeout
app.use((req, res, next) => {
  // Set a timeout for database operations
  req.dbTimeout = setTimeout(() => {
    console.error(`Database operation timeout for ${req.method} ${req.path}`);
    if (!res.headersSent) {
      res.status(504).json({
        message: 'Database operation timed out. Please try again.',
        error: 'DatabaseTimeout'
      });
    }
  }, 8000); // 8 second timeout

  res.on('finish', () => {
    clearTimeout(req.dbTimeout);
  });

  next();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/events', require('./routes/events'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/mentorship', require('./routes/mentorship'));
app.use('/api/stats', require('./routes/stats'));

const PORT = process.env.PORT || 5000;

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}