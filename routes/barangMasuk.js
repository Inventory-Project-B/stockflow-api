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
router.put("/:id", authMiddleware, updateBarangMasuk);
router.delete("/:id", authMiddleware, deleteBarangMasuk);

module.exports = router;
