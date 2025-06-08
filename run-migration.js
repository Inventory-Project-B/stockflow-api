// Database schema migration script
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true // Enable running multiple SQL statements at once
    });
    
    console.log('Connected to database successfully.');
    
    // Read migration SQL file
    const migrationFile = path.join(__dirname, 'migration-update-fields.sql');
    const migration = fs.readFileSync(migrationFile, 'utf8');
    
    console.log('Starting schema migration...');
    
    // Execute migration SQL
    await connection.query(migration);
    
    console.log('Database schema updated successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
