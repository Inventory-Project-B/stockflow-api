const express = require("express");
const {
  register,
  login,
  logout,
  updateProfile,
} = require("../controllers/authController");
const router = express.Router();

// Middleware untuk validasi input
const validateInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }
  next();
};

// Route untuk register
router.post("/register", validateInput, register);

// Route untuk login
router.post("/login", validateInput, login);

// Route untuk logout
router.post("/logout", logout);

// Route untuk update profile
router.put("/edit", updateProfile);

module.exports = router;
