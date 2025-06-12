const db = require('../database');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const profileController = {
  // Get profile
  getProfile: async (req, res) => {
    try {
      const { id } = req.user;
      
      const [users] = await db.query(
        `SELECT id, nama, nama_lengkap, username, foto_profil, email, role, created_at 
         FROM users WHERE id = ?`,
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      // Format path foto profil
      const user = users[0];
      if (user.foto_profil) {
        user.foto_profil = `${req.protocol}://${req.get('host')}${user.foto_profil}`;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const { id } = req.user;
      const { nama, nama_lengkap, username, email } = req.body;
      const file = req.file;

      // Cek apakah user ada
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      const user = users[0];

      // Cek apakah username sudah dipakai (jika diubah)
      if (username && username !== user.username) {
        const [existingUser] = await db.query(
          'SELECT id FROM users WHERE username = ? AND id != ?',
          [username, id]
        );
        if (existingUser.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Username sudah digunakan'
          });
        }
      }

      // Cek apakah email sudah dipakai (jika diubah)
      if (email && email !== user.email) {
        const [existingEmail] = await db.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, id]
        );
        if (existingEmail.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email sudah digunakan'
          });
        }
      }

      // Simpan foto jika ada
      let foto_profil = user.foto_profil;
      if (file) {
        const uploadDir = path.join(__dirname, '../uploads/profile');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate nama file unik
        const ext = path.extname(file.originalname);
        const filename = `profile_${id}${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Hapus foto lama jika ada
        if (user.foto_profil) {
          const oldPath = path.join(__dirname, '..', user.foto_profil);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Simpan file baru
        fs.writeFileSync(filepath, file.buffer);
        foto_profil = `/uploads/profile/${filename}`;
      }

      // Update user
      await db.query(
        `UPDATE users 
         SET nama = ?, nama_lengkap = ?, username = ?, email = ?, foto_profil = ? 
         WHERE id = ?`,
        [
          nama || user.nama,
          nama_lengkap || user.nama_lengkap,
          username || user.username,
          email || user.email,
          foto_profil,
          id
        ]
      );

      // Get updated user data
      const [updatedUsers] = await db.query(
        `SELECT id, nama, nama_lengkap, username, foto_profil, email, role 
         FROM users WHERE id = ?`,
        [id]
      );

      // Format path foto profil
      const updatedUser = updatedUsers[0];
      if (updatedUser.foto_profil) {
        updatedUser.foto_profil = `${req.protocol}://${req.get('host')}${updatedUser.foto_profil}`;
      }

      res.json({
        success: true,
        message: 'Profil berhasil diperbarui',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const { id } = req.user;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password lama dan baru diperlukan'
        });
      }

      // Cek apakah user ada
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      const user = users[0];

      // Validasi password lama
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Password lama tidak sesuai'
        });
      }

      // Validasi password baru
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password baru minimal 6 karakter'
        });
      }

      // Hash password baru
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

      res.json({
        success: true,
        message: 'Password berhasil diubah'
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  },
  
  // Upload profile photo
  uploadPhoto: async (req, res) => {
    try {
      const { id } = req.user;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Tidak ada file yang diunggah'
        });
      }

      // Cek apakah user ada
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      const user = users[0];

      // Simpan foto
      const uploadDir = path.join(__dirname, '../uploads/profile');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate nama file unik
      const ext = path.extname(file.originalname);
      const filename = `profile_${id}${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Hapus foto lama jika ada
      if (user.foto_profil) {
        const oldPath = path.join(__dirname, '..', user.foto_profil);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Simpan file baru
      fs.writeFileSync(filepath, file.buffer);
      const foto_profil = `/uploads/profile/${filename}`;

      // Update user
      await db.query('UPDATE users SET foto_profil = ? WHERE id = ?', [foto_profil, id]);

      res.json({
        success: true,
        message: 'Foto profil berhasil diunggah',
        data: {
          foto_profil: `${req.protocol}://${req.get('host')}${foto_profil}`
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  }
};

module.exports = profileController;
