const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// Routes untuk dashboard
router.get('/statistics', authenticateToken, dashboardController.getStatistics);
router.get('/charts/barang-masuk', authenticateToken, dashboardController.getBarangMasukChart);
router.get('/charts/barang-keluar', authenticateToken, dashboardController.getBarangKeluarChart);
router.get('/charts/pendapatan', authenticateToken, dashboardController.getPendapatanChart);
router.get('/top-selling', authenticateToken, dashboardController.getTopSellingProducts);
router.get('/category-distribution', authenticateToken, dashboardController.getCategoryDistribution);

module.exports = router;