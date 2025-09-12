const express = require('express');
const router = express.Router();

// Simple user authentication routes
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple validation (replace with proper authentication)
    if (email && password) {
      const user = {
        id: 1,
        email: email,
        name: 'User'
      };
      
      res.json({
        success: true,
        user: user,
        message: 'Login successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Simple validation (replace with proper user creation)
    if (username && email && password) {
      const user = {
        id: 1,
        username: username,
        email: email,
        name: username
      };
      
      res.json({
        success: true,
        user: user,
        message: 'Registration successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;