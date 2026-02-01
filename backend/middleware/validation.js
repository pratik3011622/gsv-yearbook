const validateRegistration = (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Email, password, and full name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  next();
};

const validateEvent = (req, res, next) => {
  const { title, description, eventDate, location, eventType } = req.body;

  if (!title || !description || !eventDate || !location || !eventType) {
    return res.status(400).json({ message: 'Title, description, event date, location, and event type are required' });
  }

  if (new Date(eventDate) < new Date()) {
    return res.status(400).json({ message: 'Event date cannot be in the past' });
  }

  next();
};

const validateJob = (req, res, next) => {
  const { title, company, description, location, jobType, domain, applyUrl } = req.body;

  if (!title || !company || !description || !location || !jobType || !domain || !applyUrl) {
    return res.status(400).json({ message: 'All job fields are required' });
  }

  const validJobTypes = ['full-time', 'part-time', 'internship', 'contract', 'freelance'];
  if (!validJobTypes.includes(jobType)) {
    return res.status(400).json({ message: 'Invalid job type' });
  }

  next();
};

const validateStory = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  // Removed strict length check and excerpt requirement
  next();
};

module.exports = {
  validateRegistration,
  validateEvent,
  validateJob,
  validateStory,
};