const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure storage for Profiles (existing logic: crop to face, square)
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gsv-yearbook/profiles',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
        ]
    }
});

const profileUpload = multer({
    storage: profileStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Configure storage for Stories (new logic: no strict crop, just optimization to save bandwidth)
const storyStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gsv-yearbook/stories',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        // No forced cropping, just quality optimization
        transformation: [
            { quality: 'auto', fetch_format: 'auto' }
        ]
    }
});

const storyUpload = multer({
    storage: storyStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (stories might need higher resolution)
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

module.exports = {
    profileUpload,
    storyUpload
};
