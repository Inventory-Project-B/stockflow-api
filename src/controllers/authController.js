const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { username, password, role } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }

      // Create new user
      const user = await User.create({
        username,
        password,
        role: role || 'user'
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Find user
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
};

module.exports = authController;
