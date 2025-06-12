const express = require("express");
const {
  getBarangKeluar,
  addBarangKeluar,
  updateBarangKeluar,
  deleteBarangKeluar,
} = require("../controllers/barangKeluarController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getBarangKeluar);
router.post("/", authMiddleware, addBarangKeluar);
router.put("/:id", authMiddleware, updateBarangKeluar);
router.delete("/:id", authMiddleware, deleteBarangKeluar);

module.exports = router;
