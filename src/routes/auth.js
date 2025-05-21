const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'stockflow123';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if credentials match
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { username: username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token: token
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
