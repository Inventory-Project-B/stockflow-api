const BarangMasuk = require('../models/barangMasuk');
const Barang = require('../models/barang');
const { sequelize } = require('../config/database');

const barangMasukController = {
  // Get all barang masuk
  getAllBarangMasuk: async (req, res) => {
    try {
      const barangMasuk = await BarangMasuk.findAll({
        include: [
          { model: Barang, attributes: ['nama_barang'] }
        ]
      });
      res.json({
        success: true,
        data: barangMasuk
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  },

  // Create barang masuk
  createBarangMasuk: async (req, res) => {
    const t = await sequelize.transaction();

    try {      const { id_barang, jumlah } = req.body;

      // Create barang masuk record
      const barangMasuk = await BarangMasuk.create({
        id_barang,
        jumlah,
        user_id: req.user.id
      }, { transaction: t });

      // Update stok barang
      const barang = await Barang.findByPk(id_barang, { transaction: t });
      if (!barang) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Barang not found'
        });
      }

      await barang.update({
        stok: barang.stok + parseInt(jumlah)
      }, { transaction: t });

      await t.commit();

      res.status(201).json({
        success: true,
        message: 'Barang masuk recorded successfully',
        data: barangMasuk
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

  // Get chart data for barang masuk
  getChartData: async (req, res) => {
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
        group: [sequelize.fn('DATE', sequelize.col('tanggal')), 'Barang.id', 'Barang.nama_barang'],
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
  }
};

module.exports = barangMasukController;
