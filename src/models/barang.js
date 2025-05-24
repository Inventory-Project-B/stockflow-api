const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Barang = sequelize.define('Barang', {
  id_barang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  kategori: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'barang',
  timestamps: true,
});

module.exports = Barang;