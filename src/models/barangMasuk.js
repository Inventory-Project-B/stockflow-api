const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Barang = require('./barang');
const User = require('./user');

const BarangMasuk = sequelize.define('BarangMasuk', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
});

// Relationships
BarangMasuk.belongsTo(Barang, { foreignKey: 'barang_id' });
BarangMasuk.belongsTo(User, { foreignKey: 'user_id' });

module.exports = BarangMasuk;
