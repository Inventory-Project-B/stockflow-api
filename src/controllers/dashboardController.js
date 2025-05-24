const Barang = require('../models/barang');
const BarangMasuk = require('../models/barangMasuk');
const BarangKeluar = require('../models/barangKeluar');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const dashboardController = {
  // Get barang chart by kategori
  getBarangByKategoriChart: async (req, res) => {
    try {
      const barangData = await Barang.findAll({
        attributes: ['kategori', [sequelize.fn('COUNT', sequelize.col('id_barang')), 'count']],
        group: ['kategori']
      });

      // Format data untuk chart
      const labels = barangData.map(item => item.kategori);
      const data = barangData.map(item => item.count);

      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            label: 'Jumlah Barang per Kategori',
            data,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF'
            ]
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
  },

  // Get chart data for barang keluar
  getBarangKeluarChart: async (req, res) => {
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
        include: [{ model: Barang, attributes: ['nama_barang', 'harga'] }],
        attributes: [
          [sequelize.fn('DATE', sequelize.col('tanggal')), 'date'],
          [sequelize.fn('SUM', sequelize.col('jumlah')), 'total']
        ],
        group: [sequelize.fn('DATE', sequelize.col('tanggal')), 'Barang.id_barang', 'Barang.nama_barang'],
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
  },

  // Get chart data for barang masuk
  getBarangMasukChart: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const barangMasukData = await BarangMasuk.findAll({
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
        ],
        group: [sequelize.fn('DATE', sequelize.col('tanggal')), 'Barang.id_barang', 'Barang.nama_barang'],
        order: [[sequelize.fn('DATE', sequelize.col('tanggal')), 'ASC']]
      });

      // Format data untuk chart
      const formattedData = barangMasukData.reduce((acc, item) => {
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
            label: 'Jumlah Barang Masuk per Hari',
            data: chartData.map(item => item.total),
            fill: false,
            borderColor: '#36A2EB',
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
  },

  // Dashboard summary
  getDashboardSummary: async (req, res) => {
    try {
      // Total barang
      const totalBarang = await Barang.count();
      
      // Total stok
      const totalStok = await Barang.sum('stok');
      
      // Total barang masuk hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const totalMasukHariIni = await BarangMasuk.sum('jumlah', {
        where: {
          tanggal: {
            [Op.between]: [today, tomorrow]
          }
        }
      }) || 0;
      
      // Total barang keluar hari ini
      const totalKeluarHariIni = await BarangKeluar.sum('jumlah', {
        where: {
          tanggal: {
            [Op.between]: [today, tomorrow]
          }
        }
      }) || 0;
      
      // Total nilai barang
      const barangList = await Barang.findAll({
        attributes: ['stok', 'harga']
      });
      
      const totalNilai = barangList.reduce((total, item) => {
        return total + (parseFloat(item.harga) * item.stok);
      }, 0);
      
      res.json({
        success: true,
        data: {
          totalBarang,
          totalStok,
          totalMasukHariIni,
          totalKeluarHariIni,
          totalNilai
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

module.exports = dashboardController;