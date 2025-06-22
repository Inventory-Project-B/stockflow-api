const db = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 8;
const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

// Image upload helper
const uploadImage = (file, userId) => {
  if (!file) return null;
  const uploadDir = path.join(__dirname, "../uploads/profile");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const ext = path.extname(file.originalname);
  const filename = `profile_${userId}${ext}`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, file.buffer);
  return `/uploads/profile/${filename}`;
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    nama,
    nama_lengkap,
    username,
    email,
    password,
    role = "pegawai",
  } = req.body;

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email atau username sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (nama, nama_lengkap, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [nama, nama_lengkap, username, email, hashedPassword, role]
    );

    const [newUser] = await db.query(
      "SELECT id, nama, nama_lengkap, username, email, role FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({ message: "Registrasi berhasil", user: newUser[0] });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  const loginIdentifier = username || email; // Use whichever is provided

  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [loginIdentifier, loginIdentifier]
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: "Nama pengguna salah" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Nama Pengguna/Kata Sandi Anda Salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, nama: user.nama },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    const { password: _, ...userData } = user;

    res.json({ message: "Login berhasil", token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout berhasil" });
};

const formatProfile = (user, req) => {
  if (user.foto_profil) {
    user.foto_profil = `${req.protocol}://${req.get("host")}${
      user.foto_profil
    }`;
  }
  return user;
};

exports.getProfile = async (req, res) => {
  const { id } = req.user;

  try {
    const [users] = await db.query(
      `SELECT id, nama, nama_lengkap, username, foto_profil, email, role, created_at FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(formatProfile(users[0], req));
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      `SELECT id, nama, nama_lengkap, username, foto_profil, email, role, created_at FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(formatProfile(users[0], req));
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.user;
  const { nama, nama_lengkap, username, email } = req.body;
  const file = req.file;

  try {
    const foto_profil = uploadImage(file, id);

    await db.query(
      `UPDATE users SET nama = ?, nama_lengkap = ?, username = ?, email = ?, foto_profil = ? WHERE id = ?`,
      [nama, nama_lengkap, username, email, foto_profil, id]
    );

    const [updatedUser] = await db.query(
      `SELECT id, nama, nama_lengkap, username, foto_profil, email, role FROM users WHERE id = ?`,
      [id]
    );

    res.json({
      message: "Profil berhasil diperbarui",
      user: formatProfile(updatedUser[0], req),
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT id, username, nama, email, role, nama_lengkap, foto_profil, created_at FROM users`;
    let countQuery = "SELECT COUNT(*) as total FROM users";
    const params = [];

    if (search) {
      query += " WHERE nama LIKE ? OR email LIKE ? OR username LIKE ?";
      countQuery += " WHERE nama LIKE ? OR email LIKE ? OR username LIKE ?";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    const [users] = await db.query(query, params);
    const [[total]] = await db.query(countQuery, params.slice(0, -2));

    res.json({
      data: users.map((u) => formatProfile(u, req)),
      pagination: {
        total: total.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total.total / limit),
      },
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nama, nama_lengkap, username, email, role } = req.body;

  try {
    const [users] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const [existing] = await db.query(
      "SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?",
      [email, username, id]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email atau username sudah digunakan" });
    }

    await db.query(
      `UPDATE users SET nama = ?, nama_lengkap = ?, username = ?, email = ?, role = ? WHERE id = ?`,
      [nama, nama_lengkap, username, email, role, id]
    );

    res.json({ message: "User berhasil diperbarui" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  if (id === currentUserId) {
    return res
      .status(400)
      .json({ message: "Tidak dapat menghapus akun sendiri" });
  }

  try {
    const [users] = await db.query(
      "SELECT foto_profil FROM users WHERE id = ?",
      [id]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const { foto_profil } = users[0];
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (foto_profil) {
      const filePath = path.join(__dirname, "../", foto_profil);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
