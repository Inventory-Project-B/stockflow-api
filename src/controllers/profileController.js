const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const profileController = {
  // Get profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id_admin, {
        attributes: { exclude: ['password'] } // Tidak mengirim password ke client
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id_admin);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const { nama_lengkap, username, email } = req.body;

      // Cek apakah username sudah dipakai (jika diubah)
      if (username && username !== user.username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }
      }

      // Cek apakah email sudah dipakai (jika diubah)
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }

      // Upload foto jika ada
      const foto = req.file ? req.file.filename : user.foto;

      // Hapus foto lama jika ada foto baru
      if (req.file && user.foto) {
        const oldPath = path.join(__dirname, '../../uploads', user.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await user.update({
        nama_lengkap: nama_lengkap || user.nama_lengkap,
        username: username || user.username,
        email: email || user.email,
        foto
      });

      // Berikan respon tanpa password
      const updatedUser = user.toJSON();
      delete updatedUser.password;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      // Hapus file upload jika ada error
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '../../uploads', req.file.filename));
      }
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Old password and new password are required'
        });
      }

      const user = await User.findByPk(req.user.id_admin);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Validasi password lama
      const isValidPassword = await user.comparePassword(oldPassword);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Old password is incorrect'
        });
      }

      // Validasi password baru
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      // Update password
      await user.update({ password: newPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
};

module.exports = profileController;