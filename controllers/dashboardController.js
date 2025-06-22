const db = require("../database");

const dashboardController = {
  // Get dashboard summary data
  getDashboardSummary: async (req, res) => {
    try {
      // Get total barang
      const [totalBarangResult] = await db.query("SELECT COUNT(*) as total FROM barang");
      const totalBarang = totalBarangResult[0].total;

      // Get total barang masuk
      const [totalBarangMasukResult] = await db.query("SELECT SUM(jumlah) as total FROM barang_masuk");
      const totalBarangMasuk = totalBarangMasukResult[0].total || 0;

      // Get total barang keluar
      const [totalBarangKeluarResult] = await db.query("SELECT SUM(jumlah) as total FROM barang_keluar");
      const totalBarangKeluar = totalBarangKeluarResult[0].total || 0;

      // Get inventory value
      const [inventoryValueResult] = await db.query("SELECT SUM(harga * stok) as total FROM barang");
      const inventoryValue = inventoryValueResult[0].total || 0;

      res.json({
        success: true,
        data: {
          totalBarang,
          totalBarangMasuk,
          totalBarangKeluar,
          inventoryValue
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  },

  // Get chart data for barang by kategori
  getBarangByKategoriChart: async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT kategori, COUNT(*) as jumlah
        FROM barang
        GROUP BY kategori
        ORDER BY jumlah DESC
      `);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  },

  // Get chart data for barang masuk
  getBarangMasukChart: async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT 
          DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal,
          SUM(jumlah) as total_barang_masuk
        FROM barang_masuk
        GROUP BY DATE_FORMAT(tanggal, '%Y-%m-%d')
        ORDER BY tanggal ASC
        LIMIT 30
      `);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Terjadi kesalahan server'
      });
    }
  },

  // Get chart data for barang keluar
  getBarangKeluarChart: async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT 
          DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal,
          SUM(jumlah) as total_barang_keluar
        FROM barang_keluar
        GROUP BY DATE_FORMAT(tanggal, '%Y-%m-%d')
        ORDER BY tanggal ASC
        LIMIT 30
      `);

      res.json({
        success: true,
        data: results
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

module.exports = dashboardController;