const express = require('express');
const router = express.Router();
const barangKeluarController = require('../controllers/barangKeluarController');
const auth = require('../middleware/auth');

router.get('/', auth, barangKeluarController.getAllBarangKeluar);
router.post('/', auth, barangKeluarController.createBarangKeluar);
router.get('/chart', auth, barangKeluarController.getChartData);

module.exports = router;
