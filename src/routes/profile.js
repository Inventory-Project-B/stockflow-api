const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Semua routes profil membutuhkan auth
router.use(auth);

// Get profile
router.get('/', profileController.getProfile);

// Update profile
router.put('/', upload.single('foto'), profileController.updateProfile);

// Change password
router.put('/change-password', profileController.changePassword);

module.exports = router;