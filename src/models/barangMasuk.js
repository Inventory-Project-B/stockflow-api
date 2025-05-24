const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Barang = require('./barang');

const BarangMasuk = sequelize.define('BarangMasuk', {
  id_bm: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tanggal: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  jumlah_masuk: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
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
  tableName: 'barang_masuk',
  timestamps: true,
});

// Definisi hubungan
BarangMasuk.belongsTo(Barang, {
  foreignKey: 'id_barang',
  as: 'barang',
});

Barang.hasMany(BarangMasuk, {
  foreignKey: 'id_barang',
  as: 'barang_masuk',
});

module.exports = BarangMasuk;