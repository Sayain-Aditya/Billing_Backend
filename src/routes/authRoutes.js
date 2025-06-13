const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Get user data
router.get('/user-data', verifyToken, async (req, res) => {
  try {
    const userData = {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    };
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Verify token
router.post('/verify-token', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;