const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Barang = require('./barang');
const User = require('./user');

const BarangKeluar = sequelize.define('BarangKeluar', {
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
  },
  jumlah_harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

// Relationships
BarangKeluar.belongsTo(Barang, { foreignKey: 'barang_id' });
BarangKeluar.belongsTo(User, { foreignKey: 'user_id' });

module.exports = BarangKeluar;
