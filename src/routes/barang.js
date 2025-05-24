const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Cek dan buat direktori jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'barang-' + uniqueSuffix + ext);
  }
});

// Filter file (hanya menerima gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (ext && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Routes untuk barang
router.get('/', authenticateToken, barangController.getAllBarang);
router.get('/categories', authenticateToken, barangController.getKategoriBarang);
router.get('/:id', authenticateToken, barangController.getBarangById);
router.post('/', authenticateToken, upload.single('foto'), barangController.createBarang);
router.put('/:id', authenticateToken, upload.single('foto'), barangController.updateBarang);
router.delete('/:id', authenticateToken, barangController.deleteBarang);

module.exports = router;