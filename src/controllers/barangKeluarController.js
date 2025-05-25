const BarangKeluar = require('../models/barangKeluar');
const Barang = require('../models/barang');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const barangKeluarController = {
  // Get all barang keluar
  getAllBarangKeluar: async (req, res) => {
    try {
      const barangKeluar = await BarangKeluar.findAll({
        include: [
          { model: Barang, attributes: ['nama_barang', 'harga'] }
        ]
      });
      res.json({
        success: true,
        data: barangKeluar
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  },

  // Create barang keluar
  createBarangKeluar: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { id_barang, jumlah } = req.body;

      // Check stok barang
      const barang = await Barang.findByPk(id_barang, { transaction: t });
      if (!barang) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Barang not found'
        });
      }

      if (barang.stok < jumlah) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Stok tidak mencukupi'
        });
      }      // Calculate jumlah_harga
      const jumlah_harga = barang.harga * parseInt(jumlah);      // Create barang keluar record
      const barangKeluar = await BarangKeluar.create({
        id_barang,
        jumlah,
        jumlah_harga,
        user_id: req.user.id
      }, { transaction: t });

      // Update stok barang
      await barang.update({
        stok: barang.stok - parseInt(jumlah)
      }, { transaction: t });

      await t.commit();

      res.status(201).json({
        success: true,
        message: 'Barang keluar recorded successfully',
        data: barangKeluar
      });
    } catch (error) {
      await t.rollback();
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
};

module.exports = barangKeluarController;
