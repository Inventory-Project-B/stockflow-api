-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 04, 2025 at 12:38 PM
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
-- Database: `stcokflow-erin`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id` int NOT NULL,
  `nama_barang` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `harga` int DEFAULT NULL,
  `stok` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id`, `nama_barang`, `harga`, `stok`, `created_at`) VALUES
(50, 'GAMIS', 50000, 49, '2025-04-04 15:52:38'),
(51, 'KOKO', 50000, 20, '2025-04-04 15:54:55'),
(52, 'MUKENA 3', 60000, 30, '2025-04-04 15:55:08'),
(53, 'DASTER', 50000, 10, '2025-04-04 15:55:34'),
(54, 'SLENDANG', 55000, 30, '2025-04-04 15:55:40'),
(55, 'ROK', 70000, 40, '2025-04-04 15:55:48'),
(60, 'harga lagi 2', 100000, 2, '2025-04-04 19:42:52'),
(61, 'test hapus', 20, 1, '2025-04-04 19:47:32'),
(62, 'barang test1', 20000, 100, '2025-04-04 20:00:00'),
(63, 'test barang baru 2', 3000, 1, '2025-04-04 20:03:11'),
(64, 'Barang Baru 25', 200000, 41, '2025-04-04 20:28:55'),
(65, 'test_hapus', 10000, 100, '2025-06-04 12:31:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
