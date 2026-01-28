const express = require('express');
const router = express.Router();
const { storyUpload } = require('../middleware/upload');
const { auth } = require('../middleware/auth');

// Generic upload endpoint for stories
router.post('/', auth, storyUpload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the secure URL from Cloudinary
        // This format works well with ReactQuill and other consumers
        res.json({
            url: req.file.path,
            secure_url: req.file.path, // Redundant but good for clarity
            public_id: req.file.filename
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

module.exports = router;
