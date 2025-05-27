// One-time script to force sync database with model changes
const { sequelize } = require('./config/database');

// Import all models to ensure they're registered with Sequelize
const User = require('./models/user');
const Barang = require('./models/barang');
const BarangMasuk = require('./models/barangMasuk');
const BarangKeluar = require('./models/barangKeluar');

// Log models to verify correct structure
console.log('User model attributes:', Object.keys(User.getAttributes()));
console.log('Barang model attributes:', Object.keys(Barang.getAttributes()));
console.log('BarangMasuk model attributes:', Object.keys(BarangMasuk.getAttributes()));
console.log('BarangKeluar model attributes:', Object.keys(BarangKeluar.getAttributes()));

const syncDB = async () => {
  try {
    console.log('Starting database force sync...');
    // This will drop all tables and recreate them based on your current model definitions
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully with force: true');
    process.exit(0);
  } catch (error) {
    console.error('Failed to sync database:', error);
    process.exit(1);
  }
};

syncDB();
