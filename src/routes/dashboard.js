const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Chart routes
router.get('/summary', auth, dashboardController.getDashboardSummary);
router.get('/chart/barang', dashboardController.getBarangByKategoriChart);
router.get('/chart/barang-masuk', dashboardController.getBarangMasukChart);
router.get('/chart/barang-keluar', dashboardController.getBarangKeluarChart);

module.exports = router;