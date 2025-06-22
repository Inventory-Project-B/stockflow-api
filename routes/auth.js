const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const authController = require("../controllers/authController");
// const authMiddleware = require('../middleware/authMiddleware');
const multer = require("multer");

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

// Konfigurasi multer (pakai memory storage karena kamu handle buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put(
  "/profile",
  authMiddleware,
  upload.single("foto_profil"), // ini penting
  authController.updateProfile
);

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Auth Routes
router.post(
  "/register",
  validate([
    body("nama").notEmpty().withMessage("Nama wajib diisi"),
    body("nama_lengkap").notEmpty().withMessage("Nama lengkap wajib diisi"),
    body("username")
      .notEmpty()
      .withMessage("Username wajib diisi")
      .isLength({ min: 3 })
      .withMessage("Username minimal 3 karakter")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username hanya boleh berisi huruf, angka dan underscore"),
    body("email")
      .notEmpty()
      .withMessage("Email wajib diisi")
      .isEmail()
      .withMessage("Email tidak valid"),
    body("password")
      .notEmpty()
      .withMessage("Password wajib diisi")
      .isLength({ min: 8 })
      .withMessage("Password minimal 8 karakter"),
  ]),
  register
);

router.post(
  "/login",
  validate([
    body(["username", "email"])
      .optional()
      .custom((value, { req }) => {
        if (!req.body.username && !req.body.email) {
          throw new Error("Username atau Email wajib diisi");
        }
        return true;
      }),
    body("password").notEmpty().withMessage("Password wajib diisi"),
  ]),
  login
);

router.post("/logout", authMiddleware, logout);

// Profile Routes
router.get("/profile", authMiddleware, getProfile);

router.put(
  "/profile",
  authMiddleware,
  uploadMiddleware.single("foto_profil"),
  validate([
    body("nama").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
    body("nama_lengkap")
      .optional()
      .notEmpty()
      .withMessage("Nama lengkap tidak boleh kosong"),
    body("username")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Username minimal 3 karakter")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username hanya boleh berisi huruf, angka dan underscore"),
    body("email").optional().isEmail().withMessage("Email tidak valid"),
    body("currentPassword")
      .if(body("password").exists())
      .notEmpty()
      .withMessage("Password saat ini wajib diisi untuk mengubah password"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password minimal 8 karakter"),
  ]),
  updateProfile
);

// Admin Routes
router.get(
  "/users",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  },
  getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin" && req.params.id !== req.user.id) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  },
  getUserById
);

router.put(
  "/users/:id",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  },
  validate([
    body("nama").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
    body("nama_lengkap")
      .optional()
      .notEmpty()
      .withMessage("Nama lengkap tidak boleh kosong"),
    body("username")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Username minimal 3 karakter")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username hanya boleh berisi huruf, angka dan underscore"),
    body("email").optional().isEmail().withMessage("Email tidak valid"),
    body("role")
      .optional()
      .isIn(["admin", "pegawai"])
      .withMessage("Role tidak valid"),
  ]),
  updateUser
);

router.delete(
  "/users/:id",
  authMiddleware,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Tidak dapat menghapus akun sendiri" });
    }
    next();
  },
  deleteUser
);

module.exports = router;
