const express = require('express');
const router = express.Router();
const barangMasukController = require('../controllers/barangMasukController');
const auth = require('../middleware/auth');

router.get('/', auth, barangMasukController.getAllBarangMasuk);
router.post('/', auth, barangMasukController.createBarangMasuk);
router.get('/chart', auth, barangMasukController.getChartData);

module.exports = router;
