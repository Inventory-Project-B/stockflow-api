-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 14, 2025 at 05:23 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.18

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
  `nama_barang` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `harga` int DEFAULT NULL,
  `stok` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id`, `nama_barang`, `harga`, `stok`, `created_at`) VALUES
(50, 'GAMIS', 40000, 49, '2025-04-04 15:52:38'),
(51, 'KOKO', 50000, 20, '2025-04-04 15:54:55'),
(52, 'MUKENA 3', 60000, 30, '2025-04-04 15:55:08'),
(53, 'DASTER', 50000, 10, '2025-04-04 15:55:34'),
(54, 'SLENDANG', 55000, 30, '2025-04-04 15:55:40'),
(55, 'ROK', 70000, 40, '2025-04-04 15:55:48'),
(60, 'harga lagi 2', 100000, 2, '2025-04-04 19:42:52'),
(61, 'test hapus', 20, 1, '2025-04-04 19:47:32'),
(62, 'barang test1', 20000, 100, '2025-04-04 20:00:00'),
(63, 'test barang baru 2', 3000, 1, '2025-04-04 20:03:11'),
(64, 'Barang Baru 25', 200000, 41, '2025-04-04 20:28:55');

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
(39, 50, 10, '2025-04-04'),
(40, 50, 1, '2025-04-03'),
(41, 50, 1, '2025-04-03'),
(42, 55, 10, '2025-04-01');

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
(22, 50, 5, '2025-04-03'),
(23, 51, 5, '2025-04-05'),
(24, 64, 12, '2025-04-03'),
(25, 52, 5, '2025-04-03'),
(26, 50, 1, '2025-04-02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_lengkap` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','pegawai') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pegawai',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `nama_lengkap`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', '', '', 'admin@mail.com', '$2y$10$frG4gIfhXwR2SGWIAnaYjuJ5DO7CEszfq6PlgsZpwkCNzbuCf534C', 'admin', '2025-03-21 13:15:05'),
(2, 'Pegawai 1', '', '', 'pegawai1@mail.com', '$2y$10$Bgb8CJjyFXq4xX/EMd05iO8LEk0ErrzWNmvyd6tyH.ZQKU/evioSG', 'pegawai', '2025-03-21 13:15:05'),
(3, 'Pegawai 3', '', '', 'pegawai3@mail.com', '$2b$10$scOKT2g8Xd8x5DjfRy.9HOvp8ozN1nGvSGLltf3cSIozH/i5JWQEC', 'pegawai', '2025-03-28 08:22:44'),
(4, 'Pegawai 4', '', '', 'pegawai4@mail.com', '$2b$10$ghtHjYXQIJ46A/rKSP5t/.CM5aKAM1jDrAj4hF2ypMBeDlgLgTZoS', 'pegawai', '2025-04-05 00:06:58');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `barang_keluar`
--
ALTER TABLE `barang_keluar`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `barang_masuk`
--
ALTER TABLE `barang_masuk`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
