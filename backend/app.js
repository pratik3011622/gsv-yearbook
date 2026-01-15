const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://sampleyearbook-frontend.vercel.app', // Production Placeholder
      process.env.FRONTEND_URL, // Production configured via Env Var
      'http://localhost:3000', // Local Vite dev server
      'http://127.0.0.1:3000', // Alternative localhost
      'http://localhost:5173', // Vite default port
      'http://127.0.0.1:5173' // Alternative localhost for Vite
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with improved configuration
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/yearbook';

    if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI environment variable is required in production');
    }

    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 5000 : 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    if (process.env.NODE_ENV === 'production') {
      throw error; // Fail fast in production
    } else {
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    }
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

const PORT = process.env.PORT || 5001;

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}