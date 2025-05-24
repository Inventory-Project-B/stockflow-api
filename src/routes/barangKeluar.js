const express = require('express');
const router = express.Router();
const barangKeluarController = require('../controllers/barangKeluarController');
const { authenticateToken } = require('../middleware/auth');

// Routes untuk barang keluar
router.get('/', authenticateToken, barangKeluarController.getAllBarangKeluar);
router.get('/:id', authenticateToken, barangKeluarController.getBarangKeluarById);
router.post('/', authenticateToken, barangKeluarController.createBarangKeluar);
router.delete('/:id', authenticateToken, barangKeluarController.deleteBarangKeluar);

module.exports = router;