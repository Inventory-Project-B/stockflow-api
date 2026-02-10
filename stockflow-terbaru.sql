-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 05, 2025 at 06:08 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stockflow`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id` int NOT NULL,
  `nama_barang` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `kategori` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `harga` int DEFAULT NULL,
  `stok` int NOT NULL DEFAULT '0',
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id`, `nama_barang`, `kategori`, `harga`, `stok`, `foto`, `created_at`) VALUES
(52, 'MUKENA 3', 'Login', 60000, 11, 'foto-1749078865134-244751454.png', '2025-04-04 15:55:08'),
(53, 'DASTER', 'Test Kategori 1', 50000, 10, 'foto-1749098019427-254883444.png', '2025-04-04 15:55:34'),
(54, 'SLENDANG', NULL, 55000, 29, NULL, '2025-04-04 15:55:40'),
(55, 'ROK', NULL, 70000, 40, NULL, '2025-04-04 15:55:48'),
(60, 'harga lagi 2', NULL, 100000, 2, NULL, '2025-04-04 19:42:52'),
(61, 'test hapus', NULL, 20, 1, NULL, '2025-04-04 19:47:32'),
(62, 'barang test1', NULL, 20000, 100, NULL, '2025-04-04 20:00:00'),
(63, 'test barang baru 2', NULL, 3000, 1, NULL, '2025-04-04 20:03:11'),
(64, 'Barang Baru 25', NULL, 200000, 41, NULL, '2025-04-04 20:28:55'),
(65, 'test_hapus', NULL, 10000, 100, NULL, '2025-06-04 12:31:42'),
(66, 'Test Barang', 'Kategori Test Ditambahkan', 1, 100, NULL, '2025-06-04 13:08:14'),
(67, 'test_hapus', NULL, 10000, 100, NULL, '2025-06-04 13:12:28'),
(68, 'test_foto_kategori', 'Elektronik', 20000, 50, 'uploaded_name.jpg', '2025-06-04 13:12:54'),
(69, 'test tambah barang 1', NULL, 20000, 1001, NULL, '2025-06-04 13:38:18'),
(70, 'test_foto_kategori', 'Elektronik', 20000, 50, 'uploaded_name.jpg', '2025-06-04 13:53:21'),
(71, '10', NULL, 1, 1, NULL, '2025-06-04 14:31:24'),
(72, 'test_foto_kategori', 'Elektronik', 20000, 50, 'uploaded_name.jpg', '2025-06-04 14:39:51'),
(73, 'test_foto_kategori', 'Elektronik', 20000, 50, 'uploaded_name.jpg', '2025-06-04 14:39:55'),
(74, 'barang1001', 'Gamis Lutut', 1001, 10, 'foto-1749048110793-894064977.png', '2025-06-04 14:41:50'),
(75, 'barang1001', 'Gamis Lutut', 1002, 10, 'foto-1749098436445-443654693.png', '2025-06-05 04:40:36');

-- --------------------------------------------------------

--
-- Table structure for table `barang_keluar`
--

CREATE TABLE `barang_keluar` (
  `id` int NOT NULL,
  `barang_id` int NOT NULL,
  `jumlah` int NOT NULL,
  `tanggal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barang_keluar`
--

INSERT INTO `barang_keluar` (`id`, `barang_id`, `jumlah`, `tanggal`) VALUES
(42, 52, 20, '2025-04-01'),
(43, 52, 10, '2025-06-05');

-- --------------------------------------------------------

--
-- Table structure for table `barang_masuk`
--

CREATE TABLE `barang_masuk` (
  `id` int NOT NULL,
  `barang_id` int NOT NULL,
  `jumlah` int NOT NULL,
  `tanggal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barang_masuk`
--

INSERT INTO `barang_masuk` (`id`, `barang_id`, `jumlah`, `tanggal`) VALUES
(21, 52, 11, '2025-04-01'),
(24, 64, 12, '2025-04-03'),
(25, 52, 5, '2025-04-03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nama_lengkap` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `foto_profil` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','pegawai') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pegawai',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `nama_lengkap`, `username`, `foto_profil`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin Utama', 'Admin Utama StockFlow', 'superadmin', '/uploads/profile/profile_1.png', 'admin@mail.com', '$2y$10$ddjZplhP1tiIY.90cLrS.e.C13nRyj6ftwKxzBsUcN2qlZ2/AIAbG', 'admin', '2025-03-21 13:15:05'),
(2, 'Pegawai 1', '', '', NULL, 'pegawai1@mail.com', '$2y$10$Bgb8CJjyFXq4xX/EMd05iO8LEk0ErrzWNmvyd6tyH.ZQKU/evioSG', 'pegawai', '2025-03-21 13:15:05'),
(3, 'Pegawai 3', '', '', NULL, 'pegawai3@mail.com', '$2b$10$scOKT2g8Xd8x5DjfRy.9HOvp8ozN1nGvSGLltf3cSIozH/i5JWQEC', 'pegawai', '2025-03-28 08:22:44'),
(4, 'Pegawai 4', '', '', NULL, 'pegawai4@mail.com', '$2b$10$ghtHjYXQIJ46A/rKSP5t/.CM5aKAM1jDrAj4hF2ypMBeDlgLgTZoS', 'pegawai', '2025-04-05 00:06:58'),
(5, 'Pegawai 5', 'Pegawai 5 Nich', 'pegawai5', NULL, 'pegawai5@mail.com', '$2b$10$4F9lez/IySAHz7PMESqKWe1IdBMt8HnGdiUJqR2aMDSJ2nTw88q/m', 'pegawai', '2025-06-05 01:07:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `barang_keluar`
--
ALTER TABLE `barang_keluar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barang_id` (`barang_id`);

--
-- Indexes for table `barang_masuk`
--
ALTER TABLE `barang_masuk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barang_id` (`barang_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `barang_keluar`
--
ALTER TABLE `barang_keluar`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `barang_masuk`
--
ALTER TABLE `barang_masuk`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang_keluar`
--
ALTER TABLE `barang_keluar`
  ADD CONSTRAINT `barang_keluar_ibfk_1` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `barang_masuk`
--
ALTER TABLE `barang_masuk`
  ADD CONSTRAINT `barang_masuk_ibfk_1` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
