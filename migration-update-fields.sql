-- Migration to update column names for consistency

-- 1. Rename primary key in 'barang' table from 'id' to 'id_barang'
ALTER TABLE `barang` CHANGE `id` `id_barang` INT NOT NULL AUTO_INCREMENT;

-- 2. Rename primary key in 'barang_keluar' table from 'id' to 'id_bk'
ALTER TABLE `barang_keluar` CHANGE `id` `id_bk` INT NOT NULL AUTO_INCREMENT;

-- 3. Rename primary key in 'barang_masuk' table from 'id' to 'id_bm'
ALTER TABLE `barang_masuk` CHANGE `id` `id_bm` INT NOT NULL AUTO_INCREMENT;

-- 4. Rename foreign key in 'barang_keluar' table from 'barang_id' to 'id_barang'
ALTER TABLE `barang_keluar` DROP FOREIGN KEY `barang_keluar_ibfk_1`;
ALTER TABLE `barang_keluar` CHANGE `barang_id` `id_barang` INT NOT NULL;
ALTER TABLE `barang_keluar` ADD CONSTRAINT `barang_keluar_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE;

-- 5. Rename foreign key in 'barang_masuk' table from 'barang_id' to 'id_barang'
ALTER TABLE `barang_masuk` DROP FOREIGN KEY `barang_masuk_ibfk_1`;
ALTER TABLE `barang_masuk` CHANGE `barang_id` `id_barang` INT NOT NULL;
ALTER TABLE `barang_masuk` ADD CONSTRAINT `barang_masuk_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE;

-- 6. Rename primary key in 'users' table from 'id' to 'id_admin'
ALTER TABLE `users` CHANGE `id` `id_admin` INT NOT NULL AUTO_INCREMENT;

-- 7. Add jumlah_harga column to barang_keluar table
ALTER TABLE `barang_keluar` ADD `jumlah_harga` DECIMAL(10,2) NULL DEFAULT NULL AFTER `jumlah`;

-- 8. Update jumlah_harga values in barang_keluar based on jumlah * harga from barang
UPDATE `barang_keluar` bk
JOIN `barang` b ON bk.`id_barang` = b.`id_barang`
SET bk.`jumlah_harga` = bk.`jumlah` * b.`harga`;
