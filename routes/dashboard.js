const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Dashboard endpoints - all endpoints require authentication
router.get("/summary", authMiddleware, dashboardController.getDashboardSummary);

// Get chart data for barang by kategori
router.get("/chart/barang", authMiddleware, dashboardController.getBarangByKategoriChart);

// Get chart data for barang masuk by date range
router.get("/chart/barang-masuk", authMiddleware, dashboardController.getBarangMasukChart);

// Get chart data for barang keluar by date range
router.get("/chart/barang-keluar", authMiddleware, dashboardController.getBarangKeluarChart);

module.exports = router;
