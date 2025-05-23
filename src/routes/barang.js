const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', barangController.getAllBarang);
router.get('/chart', barangController.getChartData);
router.get('/:id', barangController.getBarangById);

// Protected routes
router.post('/', auth, upload.single('foto'), barangController.createBarang);
router.put('/:id', auth, upload.single('foto'), barangController.updateBarang);
router.delete('/:id', auth, barangController.deleteBarang);

module.exports = router;
