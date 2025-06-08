const express = require("express");
const {
  getBarangMasuk,
  addBarangMasuk,
  updateBarangMasuk,
  deleteBarangMasuk,
} = require("../controllers/barangMasukController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getBarangMasuk);
router.post("/", authMiddleware, addBarangMasuk);
router.put("/:id_bm", authMiddleware, updateBarangMasuk);
router.delete("/:id_bm", authMiddleware, deleteBarangMasuk);

module.exports = router;
