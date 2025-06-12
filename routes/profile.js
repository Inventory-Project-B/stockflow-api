const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Semua routes profil membutuhkan auth
router.use(authMiddleware);

// Get profile
router.get('/', profileController.getProfile);

// Update profile
router.put('/', upload.single('foto'), profileController.updateProfile);

// Change password
router.put('/change-password', profileController.changePassword);

// Upload profile photo
router.post('/photo', upload.single('foto'), profileController.uploadPhoto);

module.exports = router;
