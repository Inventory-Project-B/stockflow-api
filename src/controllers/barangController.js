const Barang = require('../models/barang');
const path = require('path');
const fs = require('fs');
const sequelize = require('sequelize');

const barangController = {
  // Get all barang
  getAllBarang: async (req, res) => {
    try {
      const barang = await Barang.findAll();
      res.json({
        success: true,
        data: barang
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  },
  // Get single barang
  getBarangById: async (req, res) => {
    try {
      const barang = await Barang.findByPk(req.params.id_barang);
      if (!barang) {
        return res.status(404).json({
          success: false,
          message: 'Barang not found'
        });
      }
      res.json({
        success: true,
        data: barang
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  },

  // Create barang
  createBarang: async (req, res) => {
    try {
      const { nama_barang, stok, harga, kategori } = req.body;
      const foto = req.file ? req.file.filename : null;

      const barang = await Barang.create({
        nama_barang,
        stok,
        harga,
        kategori,
        foto
      });

      res.status(201).json({
        success: true,
        message: 'Barang created successfully',
        data: barang
      });
    } catch (error) {
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

  // Update barang
  updateBarang: async (req, res) => {
    try {
      const barang = await Barang.findByPk(req.params.id_barang);
      if (!barang) {
        return res.status(404).json({
          success: false,
          message: 'Barang not found'
        });
      }

      const { nama_barang, stok, harga, kategori } = req.body;
      const foto = req.file ? req.file.filename : barang.foto;

      // If new file uploaded, delete old file
      if (req.file && barang.foto) {
        const oldPath = path.join(__dirname, '../../uploads', barang.foto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await barang.update({
        nama_barang,
        stok,
        harga,
        kategori,
        foto
      });

      res.json({
        success: true,
        message: 'Barang updated successfully',
        data: barang
      });
    } catch (error) {
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
  // Delete barang
  deleteBarang: async (req, res) => {
    try {
      const barang = await Barang.findByPk(req.params.id_barang);
      if (!barang) {
        return res.status(404).json({
          success: false,
          message: 'Barang not found'
        });
      }

      // Delete foto if exists
      if (barang.foto) {
        const filePath = path.join(__dirname, '../../uploads', barang.foto);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await barang.destroy();

      res.json({
        success: true,
        message: 'Barang deleted successfully'
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

module.exports = barangController;
