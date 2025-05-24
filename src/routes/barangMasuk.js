const express = require('express');
const router = express.Router();
const barangMasukController = require('../controllers/barangMasukController');
const { authenticateToken } = require('../middleware/auth');

// Routes untuk barang masuk
router.get('/', authenticateToken, barangMasukController.getAllBarangMasuk);
router.get('/:id', authenticateToken, barangMasukController.getBarangMasukById);
router.post('/', authenticateToken, barangMasukController.createBarangMasuk);
router.delete('/:id', authenticateToken, barangMasukController.deleteBarangMasuk);

module.exports = router;