const Barang = require('../models/barang');
const BarangMasuk = require('../models/barangMasuk');
const BarangKeluar = require('../models/barangKeluar');
const db = require('../database');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const dashboardController = {
  // Get barang chart by kategori
  getBarangByKategoriChart: async (req, res) => {
    try {
      // Using raw SQL for databases without models/sequelize
      const [results] = await db.query(`
        SELECT kategori, COUNT(*) as count 
        FROM barang 
        WHERE kategori IS NOT NULL 
        GROUP BY kategori
      `);

      // Format data untuk chart
      const labels = results.map(item => item.kategori);
      const data = results.map(item => item.count);

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

  // Get barang masuk chart
  getBarangMasukChart: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Build the date filter
      let dateFilter = '';
      const params = [];
      
      if (startDate && endDate) {
        dateFilter = ' WHERE tanggal BETWEEN ? AND ?';
        params.push(startDate, endDate);
      } else if (startDate) {
        dateFilter = ' WHERE tanggal >= ?';
        params.push(startDate);
      } else if (endDate) {
        dateFilter = ' WHERE tanggal <= ?';
        params.push(endDate);
      }

      // Execute query
      const [results] = await db.query(`
        SELECT DATE(tanggal) as date, SUM(jumlah) as total
        FROM barang_masuk
        ${dateFilter}
        GROUP BY DATE(tanggal)
        ORDER BY date ASC
      `, params);

      // Format data untuk chart
      const labels = results.map(item => item.date);
      const data = results.map(item => item.total);

      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            label: 'Jumlah Barang Masuk per Hari',
            data,
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

  // Get barang keluar chart
  getBarangKeluarChart: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Build the date filter
      let dateFilter = '';
      const params = [];
      
      if (startDate && endDate) {
        dateFilter = ' WHERE tanggal BETWEEN ? AND ?';
        params.push(startDate, endDate);
      } else if (startDate) {
        dateFilter = ' WHERE tanggal >= ?';
        params.push(startDate);
      } else if (endDate) {
        dateFilter = ' WHERE tanggal <= ?';
        params.push(endDate);
      }

      // Execute query
      const [results] = await db.query(`
        SELECT DATE(tanggal) as date, SUM(jumlah) as total
        FROM barang_keluar
        ${dateFilter}
        GROUP BY DATE(tanggal)
        ORDER BY date ASC
      `, params);

      // Format data untuk chart
      const labels = results.map(item => item.date);
      const data = results.map(item => item.total);

      res.json({
        success: true,
        data: {
          labels,
          datasets: [{
            label: 'Jumlah Barang Keluar per Hari',
            data,
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

  // Get dashboard summary
  getDashboardSummary: async (req, res) => {
    try {
      // Get total barang
      const [barangCount] = await db.query('SELECT COUNT(*) as count FROM barang');
      const totalBarang = barangCount[0].count;

      // Get total stok
      const [stokCount] = await db.query('SELECT SUM(stok) as total FROM barang');
      const totalStok = stokCount[0].total || 0;

      // Get total nilai inventori
      const [nilaiCount] = await db.query('SELECT SUM(harga * stok) as total FROM barang');
      const totalNilai = nilaiCount[0].total || 0;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Get total barang masuk hari ini
      const [masukCount] = await db.query(
        'SELECT SUM(jumlah) as total FROM barang_masuk WHERE DATE(tanggal) = ?',
        [today]
      );
      const totalMasukHariIni = masukCount[0].total || 0;

      // Get total barang keluar hari ini
      const [keluarCount] = await db.query(
        'SELECT SUM(jumlah) as total FROM barang_keluar WHERE DATE(tanggal) = ?',
        [today]
      );
      const totalKeluarHariIni = keluarCount[0].total || 0;

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
