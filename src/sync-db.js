// One-time script to force sync database with model changes
const { sequelize } = require('./config/database');

// Import all models to ensure they're registered with Sequelize
require('./models/user');
require('./models/barang');
require('./models/barangMasuk');
require('./models/barangKeluar');

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
