const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Barang = require('./barang');

const BarangKeluar = sequelize.define('BarangKeluar', {
  id_bk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  jumlah_keluar: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  jumlah_harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  id_barang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Barang,
      key: 'id_barang',
    },
  },
}, {
  tableName: 'barang_keluar',
  timestamps: true,
});

// Definisi hubungan
BarangKeluar.belongsTo(Barang, {
  foreignKey: 'id_barang',
  as: 'barang',
});

Barang.hasMany(BarangKeluar, {
  foreignKey: 'id_barang',
  as: 'barang_keluar',
});

module.exports = BarangKeluar;