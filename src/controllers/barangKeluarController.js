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
          { model: Barang, attributes: ['nama_barang'] }
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

    try {      const { id_barang, jumlah } = req.body;

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
  },

  // Get chart data for barang keluar
  getChartData: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const barangKeluarData = await BarangKeluar.findAll({
        where: {
          tanggal: {
            [Op.between]: [
              startDate || new Date(new Date().setDate(new Date().getDate() - 30)),
              endDate || new Date()
            ]
          }
        },
        include: [{ model: Barang, attributes: ['nama_barang'] }],
        attributes: [
          [sequelize.fn('DATE', sequelize.col('tanggal')), 'date'],
          [sequelize.fn('SUM', sequelize.col('jumlah')), 'total']
        ],        group: [sequelize.fn('DATE', sequelize.col('tanggal')), 'Barang.id_barang', 'Barang.nama_barang'],
        order: [[sequelize.fn('DATE', sequelize.col('tanggal')), 'ASC']]
      });

      // Format data untuk chart
      const formattedData = barangKeluarData.reduce((acc, item) => {
        const date = item.get('date');
        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0
          };
        }
        acc[date].total += parseInt(item.get('total'));
        return acc;
      }, {});

      const chartData = Object.values(formattedData);

      res.json({
        success: true,
        data: {
          labels: chartData.map(item => item.date),
          datasets: [{
            label: 'Jumlah Barang Keluar per Hari',
            data: chartData.map(item => item.total),
            fill: false,
            borderColor: '#FF6384',
            tension: 0.1
          }]
        }
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

module.exports = barangKeluarController;
