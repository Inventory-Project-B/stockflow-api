# Database Column Renaming Migration

This folder contains files related to database schema changes.

## Changes Made:

1. Changed `id` to `id_barang` in the Barang model
2. Changed `id` to `id_bm` in the BarangMasuk model
3. Changed `id` to `id_bk` in the BarangKeluar model
4. Changed foreign key references from `barang_id` to `id_barang`

## How to Apply These Changes:

### WARNING: This will delete all existing data in the database!

1. Make sure you have a backup of your data if needed.
2. Run the sync-db.js script:

```bash
node src/sync-db.js
```

3. This will drop all tables and recreate them with the new schema.
4. After syncing, you'll need to recreate any test data or import your data back.

## Alternative (Manual SQL):

If you want to preserve your data, you can use SQL ALTER TABLE commands:

```sql
-- For Barang table
ALTER TABLE Barangs CHANGE COLUMN id id_barang INT NOT NULL AUTO_INCREMENT;

-- For BarangMasuk table
ALTER TABLE BarangMasuks CHANGE COLUMN id id_bm INT NOT NULL AUTO_INCREMENT;
ALTER TABLE BarangMasuks CHANGE COLUMN barang_id id_barang INT;

-- For BarangKeluar table
ALTER TABLE BarangKeluars CHANGE COLUMN id id_bk INT NOT NULL AUTO_INCREMENT;
ALTER TABLE BarangKeluars CHANGE COLUMN barang_id id_barang INT;
```

Note: Table names may differ depending on your Sequelize configuration.
