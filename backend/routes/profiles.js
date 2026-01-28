const { auth } = require('../middleware/auth');
const { profileUpload } = require('../middleware/upload');
const User = require('../models/User');

const router = express.Router();

// Get all profiles (authenticated users only)
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get profile by ID
router.get('/:id', async (req, res) => {
  try {
    // Try to find by Mongo ID first, then fallback to firebaseUid
    let profile = await User.findById(req.params.id).select('-password');
    if (!profile) {
      profile = await User.findOne({ firebaseUid: req.params.id }).select('-password');
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get own profile
router.get('/me/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Update own profile
router.put('/me', auth, profileUpload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('Profile update request received for UID:', req.user.firebaseUid);

    // 1. Prepare Updates Object
    const allowedFields = [
      'fullName', 'batchYear', 'department', 'company',
      'jobTitle', 'location', 'country', 'bio', 'avatarUrl',
      'linkedinUrl', 'rollNumber', 'isMentor', 'skills',
      'tagline', 'universityName', 'degree', 'specialization',
      'graduationStart', 'graduationEnd', 'currentCompany',
      'industry', 'yearsOfExperience', 'pastCompanies',
      'githubUrl', 'websiteUrl', 'achievements', 'certifications',
      'isProfilePublic'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['skills', 'pastCompanies', 'achievements', 'certifications'].includes(field)) {
          updates[field] = Array.isArray(req.body[field]) ? req.body[field] : JSON.parse(req.body[field] || '[]');
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      updates.avatarUrl = req.file.path;
    }

    // 2. Resolve User (Robust Lookup)
    // First try by firebaseUid
    let user = await User.findOne({ firebaseUid: req.user.firebaseUid });

    // If not found, try by email (to link existing disparate accounts)
    if (!user && req.user.email) {
      console.log(`User not found by UID ${req.user.firebaseUid}, trying email ${req.user.email}...`);
      user = await User.findOne({ email: req.user.email });

      if (user) {
        console.log(`Found existing user by email. Linking UID: ${req.user.firebaseUid}`);
        user.firebaseUid = req.user.firebaseUid; // Link the UID!
        // Don't save yet, we'll do it in the update step
      }
    }

    // 3. Execute Update or Create
    if (user) {
      // Update existing user
      // We manually merge updates to ensure we handle the document directly
      Object.keys(updates).forEach(key => {
        user[key] = updates[key];
      });
      // Ensure UID is set (in case we found by email)
      user.firebaseUid = req.user.firebaseUid;

      await user.save();
      console.log('Profile updated successfully for:', user.email);
    } else {
      // Create NEW user
      console.log('Creating new user for:', req.user.email);
      user = new User({
        ...updates,
        email: req.user.email,
        firebaseUid: req.user.firebaseUid,
        role: 'student' // Default role
      });
      await user.save();
      console.log('New profile created successfully.');
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    // Return a clearer error message
    res.status(500).json({ message: `Update failed: ${error.message}` });
  }
});


module.exports = router;