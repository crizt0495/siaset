-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 22, 2026 at 02:11 PM
-- Server version: 10.6.24-MariaDB-cll-lve
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `siasetgk_gkjwinventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `aktivitas`
--

CREATE TABLE `aktivitas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `aktivitas` varchar(255) NOT NULL,
  `waktu` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `aktivitas`
--

INSERT INTO `aktivitas` (`id`, `user_id`, `aktivitas`, `waktu`, `ip_address`, `user_agent`, `meta`) VALUES
(1, 1, 'Menambahkan aset baru: Komputer Kantor', '2025-10-23 19:28:22', '127.0.0.1', 'Seeder', '[]'),
(2, 1, 'Meminjamkan aset: Komputer Kantor', '2025-11-02 19:28:22', '127.0.0.1', 'Seeder', '[]'),
(3, 1, 'Mencatat mutasi aset: Meja Rapat', '2025-10-28 19:28:22', '127.0.0.1', 'Seeder', '[]'),
(4, 1, 'Menghapus barang: Sound System', '2025-11-08 00:43:06', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":3,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(5, 1, 'Menghapus barang: AC Ruangan', '2025-11-08 00:43:10', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":6,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(6, 1, 'Menghapus komisi: Komisi Keuangan', '2025-11-08 00:44:39', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":4,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(7, 1, 'Menghapus komisi: Komisi Sosial', '2025-11-08 00:44:42', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":5,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(8, 1, 'Menghapus komisi: Komisi Pemuda', '2025-11-08 00:44:45', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":6,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(9, 1, 'Membuat peminjaman barang: Meja Rapat', '2025-11-08 06:26:54', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":13,\"jumlah_dipinjam\":\"5\",\"keterangan\":\"Mencatat peminjaman barang ke yu\"}'),
(10, 1, 'Mengembalikan barang peminjaman: Meja Rapat', '2025-11-08 15:04:51', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":13,\"jumlah_dikembalikan\":5,\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(11, 1, 'Menghapus komisi: Komisi Dapur Umum', '2025-11-08 16:40:33', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":8,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(12, 1, 'Memperbarui data barang: Meja Rapat', '2025-11-08 21:00:31', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"update\",\"model\":\"Barang\",\"record_id\":4,\"keterangan\":\"Memperbarui informasi barang dan detail aset\"}'),
(13, 1, 'Membuat peminjaman barang: Speaker Aktif', '2025-11-09 00:44:41', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":14,\"jumlah_dipinjam\":\"8\",\"keterangan\":\"Mencatat peminjaman barang ke tian\"}'),
(14, 1, 'Mengembalikan barang peminjaman: Speaker Aktif', '2025-11-09 00:44:55', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":14,\"jumlah_dikembalikan\":8,\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(15, 2, 'Menghapus komisi: Komisi Administrasi', '2025-11-09 00:47:17', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":1,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(16, 2, 'Menghapus komisi: Komisi Musik', '2025-11-09 00:47:20', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":3,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(17, 2, 'Menghapus komisi: Komisi Pelayanan', '2025-11-09 00:47:23', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":2,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(18, 2, 'Menghapus komisi: Komisi Anak', '2025-11-09 00:47:26', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":7,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(19, 2, 'Menambahkan komisi baru: KPPL', '2025-11-09 00:47:32', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":9,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(20, 2, 'Menambahkan komisi baru: Komperlitbang', '2025-11-09 00:47:39', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":10,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(21, 2, 'Menambahkan komisi baru: Diakonia', '2025-11-09 00:47:58', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":11,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(22, 1, 'Membuat peminjaman barang: Papan Tulis', '2025-11-09 00:52:34', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":15,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Mencatat peminjaman barang ke tt\"}'),
(23, 1, 'Menambahkan barang baru: rt', '2025-11-09 01:49:58', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":43,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(24, 1, 'Membuat peminjaman barang: rt', '2025-11-09 01:50:34', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":16,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Mencatat peminjaman barang ke tt\"}'),
(25, 1, 'Membuat penghapusan barang: Papan Tulis - Alasan: h', '2025-11-09 01:50:48', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Penghapusan\",\"record_id\":2,\"keterangan\":\"Menghapus barang dari sistem karena: h\"}'),
(26, 2, 'Membuat peminjaman barang: Mikrofon Wireless', '2025-11-09 02:34:20', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":17,\"jumlah_dipinjam\":\"10\",\"keterangan\":\"Mencatat peminjaman barang ke tt\"}'),
(27, 2, 'Melakukan mutasi barang: Meja Rapat dari y ke t', '2025-11-09 02:34:55', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Mutasi\",\"record_id\":9,\"keterangan\":\"Memindahkan aset ke lokasi baru: t\"}'),
(28, 2, 'Membuat penghapusan barang: Laptop Pelayanan - Alasan: p', '2025-11-09 02:35:08', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Penghapusan\",\"record_id\":3,\"keterangan\":\"Menghapus barang dari sistem karena: p\"}'),
(29, 2, 'Mencatat pemeliharaan barang: Speaker Aktif', '2025-11-09 02:35:18', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Pemeliharaan\",\"record_id\":10,\"keterangan\":\"Melakukan pemeliharaan dengan biaya Rp 56,666\"}'),
(30, 2, 'Menambahkan komisi baru: KPT', '2025-11-09 02:36:02', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":12,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(31, 2, 'Menambahkan barang baru: v', '2025-11-09 02:53:30', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":44,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(32, 2, 'Menghapus barang: rt', '2025-11-09 02:54:52', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":41,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(33, 2, 'Menghapus barang: v', '2025-11-09 02:54:56', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":44,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(34, 2, 'Menghapus barang: rt', '2025-11-09 02:54:59', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":42,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(35, 2, 'Menghapus barang: rt', '2025-11-09 02:55:01', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":43,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(36, 2, 'Menambahkan barang baru: rt', '2025-11-09 02:55:24', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":45,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(37, 2, 'Menambahkan barang baru: v', '2025-11-09 15:46:20', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":46,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(38, 2, 'Menghapus barang: v', '2025-11-09 19:32:00', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":46,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(39, 1, 'Menghapus komisi: Komperlitbang', '2025-11-09 21:23:02', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":10,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(40, 2, 'Membuat peminjaman barang: rt', '2025-11-09 22:30:48', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":18,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Mencatat peminjaman barang ke ry\"}'),
(41, 2, 'Menambahkan barang baru: rt', '2025-11-10 14:56:11', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":47,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(42, 1, 'Mengembalikan barang peminjaman: rt', '2025-11-10 15:55:50', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":18,\"jumlah_dikembalikan\":1,\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(43, 2, 'Menghapus barang: rt', '2025-11-10 15:56:40', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":47,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(44, 2, 'Menambahkan barang baru: g', '2025-11-10 15:57:14', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":48,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(45, 1, 'Menghapus barang: g', '2025-11-10 16:27:14', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":48,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(46, 1, 'Menambahkan barang baru: rt', '2025-11-10 16:28:27', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":49,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(47, 2, 'Membuat peminjaman barang: rt', '2025-11-10 17:41:47', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":19,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Mencatat peminjaman barang ke o\"}'),
(48, 2, 'Mengembalikan barang peminjaman: rt', '2025-11-10 17:41:51', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":19,\"jumlah_dikembalikan\":1,\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(49, 2, 'Melakukan mutasi barang: rt dari k ke i', '2025-11-10 17:42:12', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Mutasi\",\"record_id\":10,\"keterangan\":\"Memindahkan aset ke lokasi baru: i\"}'),
(50, 2, 'Menambahkan barang baru: b', '2025-11-10 19:38:30', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":50,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(51, 2, 'Memperbarui data barang: rt', '2025-11-11 01:04:15', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"update\",\"model\":\"Barang\",\"record_id\":45,\"keterangan\":\"Memperbarui informasi barang dan detail aset\"}'),
(52, 5, 'Menambahkan barang baru: h', '2025-11-11 01:11:51', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":51,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(53, 5, 'Menambahkan barang baru: rt', '2025-11-11 01:23:54', '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":52,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(54, 5, 'Menambahkan barang baru: gg', '2025-11-11 16:23:21', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":53,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(55, 5, 'Menghapus komisi: Komisi Administrasi', '2025-11-11 16:24:39', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":13,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(56, 5, 'Menghapus komisi: Komisi Dapur Umum', '2025-11-11 16:24:42', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":20,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(57, 5, 'Menghapus komisi: Komisi Anak', '2025-11-11 16:24:45', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":19,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(58, 5, 'Menghapus komisi: Komisi Pemuda', '2025-11-11 16:24:48', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":18,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(59, 5, 'Menghapus komisi: Komisi Sosial', '2025-11-11 16:24:50', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":17,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(60, 5, 'Menghapus komisi: Komisi Pelayanan', '2025-11-11 16:24:53', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":14,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(61, 5, 'Menghapus komisi: Komisi Musik', '2025-11-11 16:24:55', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":15,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(62, 5, 'Menghapus komisi: Komisi Keuangan', '2025-11-11 16:24:58', '110.137.102.97', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":16,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(63, 2, 'Menghapus peminjaman barang ID: 19', '2025-11-11 17:48:55', '36.73.199.108', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Peminjaman\",\"record_id\":19,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Menghapus data peminjaman\"}'),
(64, 2, 'Menghapus peminjaman barang ID: 18', '2025-11-11 17:48:57', '36.73.199.108', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Peminjaman\",\"record_id\":18,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Menghapus data peminjaman\"}'),
(65, 2, 'Menambahkan komisi baru: Komperlitbang', '2025-11-11 20:04:30', '36.73.199.108', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":21,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(66, 2, 'Menambahkan komisi baru: BP Tanggul Bencana', '2025-11-11 20:05:03', '36.73.199.108', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":22,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(67, 5, 'Menambahkan barang baru: r', '2025-11-11 20:58:37', '36.73.199.108', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":54,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(68, 5, 'Menambahkan komisi baru: KPK', '2025-11-11 21:07:31', '36.73.199.108', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":23,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(69, 2, 'Menghapus barang: h', '2025-11-11 21:11:48', '36.73.199.108', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":51,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(70, 2, 'Menghapus barang: b', '2025-11-11 21:12:05', '36.73.199.108', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":50,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(71, 2, 'Menghapus barang: rt', '2025-11-11 21:13:21', '36.73.199.108', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":45,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(72, 2, 'Menghapus barang: gg', '2025-11-11 21:13:32', '36.73.199.108', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":53,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(73, 2, 'Memperbarui data barang: r', '2025-11-11 22:03:02', '36.73.199.108', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"update\",\"model\":\"Barang\",\"record_id\":54,\"keterangan\":\"Memperbarui informasi barang dan detail aset\"}'),
(74, 2, 'Menghapus barang: r', '2025-11-11 23:20:01', '110.137.103.6', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":54,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(75, 2, 'Menghapus barang: rt', '2025-11-11 23:20:06', '110.137.103.6', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":52,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(76, 2, 'Menghapus barang: rt', '2025-11-11 23:20:12', '110.137.103.6', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":49,\"keterangan\":\"Menghapus barang dari sistem\"}'),
(77, 2, 'Menambahkan barang baru: meja rapat', '2025-11-12 05:10:35', '114.8.222.238', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":55,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(78, 2, 'Membuat peminjaman barang: meja rapat', '2025-11-12 05:19:55', '114.8.222.238', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":20,\"jumlah_dipinjam\":\"5\",\"keterangan\":\"Mencatat peminjaman barang ke coba\"}'),
(79, 2, 'Mengembalikan barang peminjaman: meja rapat', '2025-11-12 05:20:21', '114.8.222.238', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":20,\"jumlah_dikembalikan\":\"5\",\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(80, 2, 'Menambahkan barang baru: Obat obatan', '2025-11-12 06:42:41', '114.8.222.238', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":56,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(81, 2, 'Memperbarui data barang: Lemari obat-obatan', '2025-11-13 00:23:31', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"update\",\"model\":\"Barang\",\"record_id\":56,\"keterangan\":\"Memperbarui informasi barang dan detail aset\"}'),
(82, 2, 'Menambahkan barang baru: Tensimeter Raksa', '2025-11-13 00:25:34', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":57,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(83, 2, 'Menambahkan barang baru: Tensi clock', '2025-11-13 00:26:42', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":58,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(84, 2, 'Memperbarui data barang: Tensimeter Raksa', '2025-11-13 00:27:04', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"update\",\"model\":\"Barang\",\"record_id\":57,\"keterangan\":\"Memperbarui informasi barang dan detail aset\"}'),
(85, 2, 'Menambahkan barang baru: Stethoscope', '2025-11-13 00:44:39', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":59,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(86, 2, 'Menambahkan barang baru: alat cek gula darah', '2025-11-13 00:45:40', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":60,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(87, 2, 'Menambahkan barang baru: alat hand sanitizer otomatis', '2025-11-13 00:46:22', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":61,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(88, 2, 'Menambahkan barang baru: alat hand sanitizer tembak', '2025-11-13 00:47:10', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":62,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(89, 2, 'Menambahkan barang baru: Termogun', '2025-11-13 00:47:46', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":63,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(90, 2, 'Menambahkan barang baru: Termogun Otomatis', '2025-11-13 00:48:39', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":64,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(91, 2, 'Menambahkan barang baru: Kruk kaki 1', '2025-11-13 00:49:27', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":65,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(92, 2, 'Menambahkan barang baru: Kruk Kaki 3', '2025-11-13 00:50:25', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":66,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(93, 2, 'Menambahkan barang baru: Kruk Kaki 4', '2025-11-13 00:51:16', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":67,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(94, 2, 'Menambahkan barang baru: Meja dan taplak', '2025-11-13 00:52:30', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":68,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(95, 2, 'Menambahkan barang baru: kursi biru', '2025-11-13 00:53:25', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":69,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(96, 2, 'Menambahkan barang baru: Etalase', '2025-11-13 00:56:51', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":70,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(97, 2, 'Menambahkan barang baru: Meja Panjang', '2025-11-13 00:57:45', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":71,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(98, 2, 'Menambahkan barang baru: Kursi Sofa', '2025-11-13 01:00:18', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":72,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(99, 2, 'Menambahkan barang baru: Tempat tidur (Dipan)', '2025-11-13 01:01:20', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":73,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(100, 2, 'Menambahkan barang baru: Kasur', '2025-11-13 01:02:04', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":74,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(101, 2, 'Menambahkan barang baru: kulkas', '2025-11-13 01:02:52', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":75,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(102, 2, 'Menambahkan barang baru: timbangan digital', '2025-11-13 01:03:33', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":76,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(103, 2, 'Menambahkan barang baru: Timbangan manual', '2025-11-13 01:04:22', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":77,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(104, 2, 'Menambahkan barang baru: Tempat Sampah', '2025-11-13 01:05:04', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":78,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(105, 2, 'Menambahkan barang baru: Tensi digital', '2025-11-13 01:20:01', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":79,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(106, 2, 'Menambahkan barang baru: Tensi digital', '2025-11-13 01:20:34', '36.73.195.76', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":80,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(107, 2, 'Menambahkan barang baru: Buku Resume PKT & ORTALA 2022', '2025-11-13 04:33:32', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":81,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(108, 2, 'Menambahkan barang baru: Buku Resume PKT 2024', '2025-11-13 04:34:53', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":82,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(109, 2, 'Menambahkan barang baru: Buku Hasil Rembug Warga 2022', '2025-11-13 04:36:43', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":83,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(110, 2, 'Menambahkan barang baru: Buku ORTALA 2022-2024', '2025-11-13 04:38:56', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":84,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(111, 2, 'Menambahkan barang baru: Buku PKT 2022 Komisi', '2025-11-13 04:39:44', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":85,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(112, 2, 'Menambahkan barang baru: Buku PKT 2022 Non Komisi', '2025-11-13 04:40:38', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":86,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(113, 2, 'Menambahkan barang baru: Buku PKT 2023 Non Komisi', '2025-11-13 04:41:24', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":87,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(114, 2, 'Menambahkan barang baru: Buku PKT 2024 Komisi', '2025-11-13 04:42:13', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":88,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(115, 2, 'Menambahkan barang baru: Buku PKT 2024 Non Komisi', '2025-11-13 04:43:15', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":89,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(116, 2, 'Menambahkan komisi baru: Sekretariat', '2025-11-13 04:45:18', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":24,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(117, 2, 'Menambahkan barang baru: Laptop  ACER', '2025-11-13 04:47:03', '110.137.100.242', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":90,\"keterangan\":\"Menambahkan barang baru beserta QR code dan informasi aset\"}'),
(118, 1, 'Menambahkan komisi baru: KPAR', '2025-11-15 05:11:03', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":25,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(119, 1, 'Menambahkan komisi baru: KPPW', '2025-11-15 05:11:08', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":26,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(120, 1, 'Menambahkan komisi baru: KAUM', '2025-11-15 05:11:20', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":27,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(121, 1, 'Menambahkan komisi baru: KMTI', '2025-11-15 05:11:29', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":28,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(122, 1, 'Menambahkan komisi baru: KP2J', '2025-11-15 05:13:42', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":29,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(123, 1, 'Menambahkan komisi baru: KPAY', '2025-11-15 05:13:59', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":30,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(124, 1, 'Menambahkan komisi baru: KPPCK', '2025-11-15 05:14:07', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":31,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(125, 1, 'Menambahkan komisi baru: KPPM', '2025-11-15 05:14:20', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":32,\"keterangan\":\"Menambahkan komisi baru untuk organisasi gereja\"}'),
(126, 5, 'Menambahkan barang baru: Piring bambu', '2025-11-15 05:17:30', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":91,\"jumlah\":\"89\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(127, 5, 'Menambahkan barang baru: Teko 2L', '2025-11-15 05:18:04', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":92,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(128, 5, 'Menambahkan barang baru: Teko 1L', '2025-11-15 06:21:46', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":97,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(129, 5, 'Menambahkan barang baru: Cool tank besar', '2025-11-15 06:22:23', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":98,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(130, 1, 'Menghapus barang: meja rapat', '2025-11-15 06:25:14', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":55,\"keterangan\":\"Menghapus aset dari inventaris\"}'),
(131, 5, 'Menambahkan barang baru: KIPAS ANGIN', '2025-11-15 06:27:05', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":99,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(132, 5, 'Menambahkan barang baru: MEJA', '2025-11-15 06:27:48', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":100,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(133, 5, 'Menambahkan barang baru: KURSI', '2025-11-15 06:28:51', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":101,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(134, 5, 'Menambahkan barang baru: kAMAR TIDUR', '2025-11-15 06:29:23', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":102,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(135, 5, 'Menambahkan barang baru: LEMARI', '2025-11-15 06:30:14', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":103,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(136, 5, 'Menambahkan barang baru: Cool tank kecil', '2025-11-15 06:34:57', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":104,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(137, 5, 'Menambahkan barang baru: Piring makan umum', '2025-11-15 06:35:44', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":105,\"jumlah\":\"300\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(138, 5, 'Menambahkan barang baru: Piring makan putih polos', '2025-11-15 06:41:53', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":106,\"jumlah\":\"36\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(139, 5, 'Menambahkan barang baru: Piring makan motif campur', '2025-11-15 07:13:07', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":107,\"jumlah\":\"37\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(140, 5, 'Membuat peminjaman barang: Piring makan umum', '2025-11-15 07:16:22', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":21,\"jumlah_dipinjam\":\"13\",\"keterangan\":\"Mencatat peminjaman barang ke t\"}'),
(141, 5, 'Mengembalikan barang peminjaman: Piring makan umum', '2025-11-15 07:16:31', '110.137.102.32', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":21,\"jumlah_dikembalikan\":\"13\",\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(142, 1, 'Menghapus barang: Laptop  ACER', '2025-11-15 15:22:21', '110.137.102.32', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":90,\"keterangan\":\"Menghapus aset dari inventaris\"}'),
(143, 1, 'Menghapus komisi: Sekretariat', '2025-11-15 15:22:28', '110.137.102.32', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":24,\"keterangan\":\"Menghapus komisi dari sistem\"}'),
(144, 1, 'Menghapus peminjaman barang ID: 21', '2025-11-15 15:46:04', '110.137.102.32', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Peminjaman\",\"record_id\":21,\"jumlah_dipinjam\":\"13\",\"keterangan\":\"Menghapus data peminjaman\"}'),
(145, 5, 'Menambahkan barang baru: Kursi Jemaat', '2025-11-15 18:39:06', '114.8.222.252', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":108,\"jumlah\":\"53\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(146, 5, 'Menambahkan barang baru: Kipas Angin', '2025-11-15 18:40:12', '114.8.222.252', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":109,\"jumlah\":\"10\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(147, 5, 'Menambahkan barang baru: Kursi tanpa sandaran', '2025-11-15 18:43:52', '114.8.222.252', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":110,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(148, 5, 'Menambahkan barang baru: Jam Dinding', '2025-11-15 18:45:52', '114.8.222.252', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":111,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(149, 2, 'Menambahkan barang baru: Sepatu Boot', '2025-11-18 01:14:31', '36.73.198.106', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":112,\"jumlah\":\"6\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(150, 2, 'Menambahkan barang baru: Uang tunai', '2025-11-18 01:18:51', '36.73.198.106', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":113,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(151, 5, 'Menambahkan barang baru: Sendok kecil', '2025-11-21 17:26:38', '110.137.101.252', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":114,\"jumlah\":\"70\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(152, 1, 'Menambahkan pengguna baru: Komperlitbang', '2025-12-03 00:54:19', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":7,\"username\":\"komperlitbang\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(153, 1, 'Menghapus pengguna: Komperlitbang', '2025-12-03 01:04:34', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"User\",\"user_id\":7,\"nama_lengkap\":\"Komperlitbang\"}'),
(154, 1, 'Menambahkan pengguna baru: Komperlitbang', '2025-12-03 01:04:58', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":8,\"username\":\"komperlitbang\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(155, 1, 'Menambahkan pengguna baru: Diakonia', '2025-12-03 01:07:24', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":9,\"username\":\"diakonia\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}');
INSERT INTO `aktivitas` (`id`, `user_id`, `aktivitas`, `waktu`, `ip_address`, `user_agent`, `meta`) VALUES
(156, 1, 'Menambahkan pengguna baru: KPPL', '2025-12-03 01:10:46', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":10,\"username\":\"kppl\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(157, 1, 'Menambahkan pengguna baru: KPPM', '2025-12-03 01:15:08', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":11,\"username\":\"kppm\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(158, 1, 'Menambahkan pengguna baru: KPPCK', '2025-12-03 01:15:41', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":12,\"username\":\"kppck\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(159, 1, 'Menambahkan pengguna baru: KPAY', '2025-12-03 01:16:17', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":13,\"username\":\"kpay\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(160, 1, 'Menambahkan pengguna baru: KP2J', '2025-12-03 01:16:55', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":14,\"username\":\"kp2j\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(161, 1, 'Menambahkan pengguna baru: KMTI', '2025-12-03 01:17:25', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":15,\"username\":\"kmti\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(162, 1, 'Menambahkan pengguna baru: KAUM', '2025-12-03 01:17:56', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":16,\"username\":\"kaum\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(163, 1, 'Menambahkan pengguna baru: KPPW', '2025-12-03 01:18:44', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":17,\"username\":\"kppw\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(164, 1, 'Menambahkan pengguna baru: KPAR', '2025-12-03 01:19:33', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":18,\"username\":\"kpar\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(165, 1, 'Menambahkan pengguna baru: KPK', '2025-12-03 01:19:56', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":19,\"username\":\"kpk\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(166, 1, 'Menambahkan pengguna baru: KPT', '2025-12-03 01:20:48', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":20,\"username\":\"kpt\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(167, 1, 'Menambahkan pengguna baru: BP Tanggul Bencana', '2025-12-03 01:21:37', '36.73.202.75', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":21,\"username\":\"bptanggulbencana\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(168, 10, 'Menambahkan barang baru: Kipas Angin', '2025-12-06 12:05:01', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":115,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(169, 10, 'Membuat peminjaman barang: KIPAS ANGIN', '2025-12-06 12:05:20', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":22,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Mencatat peminjaman barang ke h\"}'),
(170, 10, 'Mengembalikan barang peminjaman: KIPAS ANGIN', '2025-12-06 12:05:27', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":22,\"jumlah_dikembalikan\":\"1\",\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(171, 10, 'Menambahkan barang baru: Stop Kontak Isi 4', '2025-12-06 12:06:22', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":116,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(172, 10, 'Menambahkan barang baru: Stop Kontak T', '2025-12-06 12:07:47', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":117,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(173, 10, 'Menambahkan barang baru: VGA Splitter', '2025-12-06 12:16:48', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":118,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(174, 10, 'Menambahkan barang baru: Lonceng', '2025-12-06 12:19:24', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":119,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(175, 10, 'Menambahkan barang baru: Lonceng', '2025-12-06 12:19:25', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":120,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(176, 10, 'Menambahkan barang baru: Lampu Neon Isi 1', '2025-12-06 12:19:57', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":121,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(177, 10, 'Menambahkan barang baru: Stand Speaker', '2025-12-06 12:20:33', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":122,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(178, 10, 'Menambahkan barang baru: Stand Speaker', '2025-12-06 12:21:39', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":123,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(179, 10, 'Menambahkan barang baru: Stand Book', '2025-12-06 12:22:37', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":124,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(180, 10, 'Menambahkan barang baru: Rumah Lampu', '2025-12-06 12:23:58', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":125,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(181, 10, 'Menambahkan barang baru: Speaker', '2025-12-06 12:24:59', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":126,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(182, 10, 'Menambahkan barang baru: R.Multimedia', '2025-12-06 12:25:36', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":127,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(183, 10, 'Menambahkan barang baru: Layar Proyektor', '2025-12-06 12:26:16', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":128,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(184, 10, 'Menambahkan barang baru: CCTV', '2025-12-06 12:26:34', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":129,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(185, 10, 'Menambahkan barang baru: Meja Kayu', '2025-12-06 12:27:47', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":130,\"jumlah\":\"6\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(186, 10, 'Menambahkan barang baru: Meja Kayu Denan Laci 6', '2025-12-06 12:28:24', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":131,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(187, 10, 'Menambahkan barang baru: Meja Kayu Denan Laci 6', '2025-12-06 12:28:24', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":132,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(188, 2, 'Menghapus barang: Meja Kayu Denan Laci 6', '2025-12-06 12:29:26', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":132,\"keterangan\":\"Menghapus aset dari inventaris\"}'),
(189, 10, 'Menambahkan barang baru: Papan Pelayanan', '2025-12-06 12:30:31', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":133,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(190, 10, 'Menambahkan barang baru: Papan Jadwal Khotbah', '2025-12-06 12:32:30', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":134,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(191, 10, 'Menambahkan barang baru: Papan Jadwal Organis Song Leader', '2025-12-06 12:34:00', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":135,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(192, 10, 'Menambahkan barang baru: Papan Agenda Kegiatan', '2025-12-06 12:34:33', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":136,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(193, 10, 'Menambahkan barang baru: Cermin', '2025-12-06 12:35:58', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":137,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(194, 10, 'Menambahkan barang baru: Meja Tempat Dispenser', '2025-12-06 12:36:33', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":138,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(195, 10, 'Menambahkan barang baru: Dispenser Miyakot Galon', '2025-12-06 12:37:35', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":139,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(196, 10, 'Menambahkan barang baru: Dispenser Denpo 0', '2025-12-06 12:38:14', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":140,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(197, 10, 'Menambahkan barang baru: Kabel Roll Isi 2', '2025-12-06 12:39:40', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":141,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(198, 10, 'Menambahkan barang baru: Monitor CCTV', '2025-12-06 12:40:15', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":142,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(199, 10, 'Menambahkan barang baru: Kotak Trafo CCTV', '2025-12-06 12:41:12', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":143,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(200, 10, 'Menambahkan barang baru: Kotak Visilink', '2025-12-06 12:41:56', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":144,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(201, 10, 'Menambahkan barang baru: Kotak Penghapus + Spidol', '2025-12-06 12:43:50', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":145,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(202, 10, 'Menambahkan barang baru: Lampu Neon Panjang', '2025-12-06 12:45:02', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":146,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(203, 10, 'Menambahkan barang baru: Figura + Foto Pendeta', '2025-12-06 12:45:40', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":147,\"jumlah\":\"8\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(204, 10, 'Menambahkan barang baru: Tempat Sampah', '2025-12-06 12:47:05', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":148,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(205, 10, 'Menambahkan barang baru: CCTV', '2025-12-06 12:47:36', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":149,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(206, 10, 'Menambahkan barang baru: Cermin', '2025-12-06 12:48:39', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":150,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(207, 10, 'Menambahkan barang baru: Tabung Apar', '2025-12-06 12:49:16', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":151,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(208, 10, 'Menambahkan barang baru: Lemari Besi Hijau', '2025-12-06 12:49:45', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":152,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(209, 10, 'Menambahkan barang baru: Papan GKJW', '2025-12-06 12:50:23', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":153,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(210, 10, 'Menambahkan barang baru: Meja Dorong', '2025-12-06 12:50:55', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":154,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(211, 10, 'Menambahkan barang baru: Dispenser Sharp + Galon', '2025-12-06 12:51:38', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":155,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(212, 10, 'Menambahkan barang baru: Tatakan Dispenser Kaki 4', '2025-12-06 12:54:31', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":156,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(213, 10, 'Menambahkan barang baru: Tempat Sampah', '2025-12-06 12:55:08', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":157,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(214, 10, 'Menambahkan barang baru: Rak Galon & Peralatan Lainnya', '2025-12-06 12:55:44', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":158,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(215, 10, 'Menambahkan barang baru: Kipas Angin Duduk', '2025-12-06 12:56:11', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":159,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(216, 10, 'Menambahkan barang baru: Kipas Angin Maspion', '2025-12-06 12:56:42', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":160,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(217, 10, 'Menambahkan barang baru: Meja Kayu', '2025-12-06 12:58:26', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":161,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(218, 10, 'Menambahkan barang baru: Jam Dinding', '2025-12-06 12:58:55', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":162,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(219, 10, 'Menambahkan barang baru: CCTV', '2025-12-06 12:59:25', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":163,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(220, 10, 'Menambahkan barang baru: Tempat Sampah', '2025-12-06 13:07:23', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":164,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(221, 10, 'Menambahkan barang baru: Peta Wilayah Warga', '2025-12-06 13:08:08', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":165,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(222, 10, 'Menambahkan barang baru: Rangka Besi Banner', '2025-12-06 13:09:03', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":166,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(223, 10, 'Menambahkan barang baru: Wastafel', '2025-12-06 13:09:36', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":167,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(224, 10, 'Menambahkan barang baru: Tempat Pemilah Sampah', '2025-12-06 13:11:47', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":168,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(225, 10, 'Menambahkan barang baru: Papan Pengumuman Aluminium', '2025-12-06 13:12:30', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":169,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(226, 10, 'Menambahkan barang baru: Koper Wadah Amplop', '2025-12-06 13:15:49', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":170,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(227, 10, 'Menambahkan barang baru: Dispenser + Galon', '2025-12-06 13:16:16', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":171,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(228, 10, 'Menambahkan barang baru: CCTV', '2025-12-06 13:17:06', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":172,\"jumlah\":\"5\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(229, 10, 'Menambahkan barang baru: Kursi Kayu Dengan Sandaran', '2025-12-06 13:17:33', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":173,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(230, 10, 'Menambahkan barang baru: Kursi Kayu Tanpa Sandaran', '2025-12-06 13:18:26', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":174,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(231, 10, 'Menambahkan barang baru: Meja Kayu Kotak Putih', '2025-12-06 13:36:53', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":175,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(232, 10, 'Menambahkan barang baru: Meja Kayu Kotak Dengan Roda', '2025-12-06 13:37:39', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":176,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(233, 10, 'Menambahkan barang baru: Tempat Sampah Plastik Anyaman', '2025-12-06 13:38:18', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":177,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(234, 10, 'Menambahkan barang baru: MCB', '2025-12-06 13:38:48', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":178,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(235, 17, 'Menambahkan barang baru: Sendok makan', '2025-12-06 14:26:18', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":179,\"jumlah\":\"192\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(236, 17, 'Menambahkan barang baru: Sendok teh panjang', '2025-12-06 14:26:43', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":180,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(237, 17, 'Menambahkan barang baru: Garpu', '2025-12-06 14:27:02', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":181,\"jumlah\":\"16\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(238, 17, 'Menambahkan barang baru: Gelas warna warni dalam boks putih', '2025-12-06 14:27:21', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":182,\"jumlah\":\"59\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(239, 17, 'Menambahkan barang baru: Centong sayur besar', '2025-12-06 14:27:53', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":183,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(240, 17, 'Menambahkan barang baru: Centong sayur kecil', '2025-12-06 14:28:14', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":184,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(241, 17, 'Menambahkan barang baru: Centong nasi', '2025-12-06 14:30:03', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":185,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(242, 17, 'Menambahkan barang baru: Japitan stainless kecil', '2025-12-06 14:30:24', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":186,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(243, 17, 'Menambahkan barang baru: Japitan stainless besar', '2025-12-06 14:32:21', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":187,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(244, 17, 'Menambahkan barang baru: Gelas piala', '2025-12-06 14:32:52', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":188,\"jumlah\":\"12\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(245, 17, 'Menambahkan barang baru: Tutup gelas piala', '2025-12-06 14:33:14', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":189,\"jumlah\":\"12\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(246, 17, 'Menambahkan barang baru: Piring puding ceper putih', '2025-12-06 14:33:33', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":190,\"jumlah\":\"20\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(247, 17, 'Menambahkan barang baru: Piring puding bening', '2025-12-06 14:34:19', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":191,\"jumlah\":\"36\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(248, 17, 'Menambahkan barang baru: Alat serbat', '2025-12-06 14:34:41', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":192,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(249, 17, 'Menambahkan barang baru: Tempat sayur kotak', '2025-12-06 14:35:09', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":193,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(250, 17, 'Menambahkan barang baru: Baki kayu besar', '2025-12-06 14:35:32', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":194,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(251, 17, 'Menambahkan barang baru: Gelas pendek rak 1', '2025-12-06 14:36:33', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":195,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(252, 17, 'Menambahkan barang baru: Gelas pendek rak 2', '2025-12-06 14:36:49', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":196,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(253, 17, 'Menambahkan barang baru: Gelas pendek rak 3', '2025-12-06 14:37:20', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":197,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(254, 17, 'Menambahkan barang baru: Gelas kaki rak 4', '2025-12-06 14:39:07', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":198,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(255, 17, 'Menambahkan barang baru: Gelas panjang rak 4', '2025-12-06 14:39:35', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":199,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(256, 17, 'Menambahkan barang baru: Gelas pendek rak 4', '2025-12-06 14:39:54', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":200,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(257, 17, 'Menambahkan barang baru: Gelas campur', '2025-12-06 14:40:33', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":201,\"jumlah\":\"61\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(258, 17, 'Menambahkan barang baru: Piring', '2025-12-06 14:41:16', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":202,\"jumlah\":\"234\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(259, 17, 'Menambahkan barang baru: Lepek', '2025-12-06 14:41:44', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":203,\"jumlah\":\"6\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(260, 17, 'Menambahkan barang baru: Mangkok', '2025-12-06 14:43:02', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":204,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(261, 17, 'Menambahkan barang baru: Piring saji', '2025-12-06 14:43:29', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":205,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(262, 17, 'Menambahkan barang baru: Panel lorek', '2025-12-06 14:44:00', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":206,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(263, 17, 'Menambahkan barang baru: Tutup gelas', '2025-12-06 14:44:17', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":207,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(264, 17, 'Menambahkan barang baru: Nampan seng kecil', '2025-12-06 14:44:34', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":208,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(265, 17, 'Menambahkan barang baru: Tempeh plastik besar', '2025-12-06 14:44:58', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":209,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(266, 17, 'Menambahkan barang baru: Nampan plastik kecil', '2025-12-06 14:45:23', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":210,\"jumlah\":\"10\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(267, 17, 'Menambahkan barang baru: Taplak plastik coklat', '2025-12-06 14:45:59', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":211,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(268, 17, 'Menambahkan barang baru: Termos nasi', '2025-12-06 14:47:20', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":212,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(269, 17, 'Menambahkan barang baru: Teko bunyi', '2025-12-06 14:47:49', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":213,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(270, 17, 'Menambahkan barang baru: Termos air', '2025-12-06 14:48:48', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":214,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(271, 17, 'Menambahkan barang baru: Kompor gas 2 tungku', '2025-12-06 14:49:06', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":215,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(272, 17, 'Menambahkan barang baru: Tabung gas 12 kg', '2025-12-06 14:49:27', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":216,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(273, 17, 'Menambahkan barang baru: Galon', '2025-12-06 14:50:04', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":217,\"jumlah\":\"4\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(274, 17, 'Menambahkan barang baru: Dispenser', '2025-12-06 14:50:27', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":218,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(275, 17, 'Menambahkan barang baru: Tempat tisu', '2025-12-06 14:50:56', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":219,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(276, 17, 'Menambahkan barang baru: Tempat gelas air', '2025-12-06 14:51:37', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":220,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(277, 17, 'Menambahkan barang baru: Panel sayur ukuran kecil', '2025-12-06 14:51:58', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":221,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(278, 17, 'Menambahkan barang baru: Mangkok sayur coklat', '2025-12-06 14:55:49', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":222,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(279, 17, 'Menambahkan barang baru: Tempat makan utk PH', '2025-12-06 14:56:58', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":223,\"jumlah\":\"11\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(280, 18, 'Menambahkan barang baru: Etalase', '2025-12-06 14:58:50', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":224,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(281, 18, 'Menambahkan barang baru: Etalase kecil', '2025-12-06 14:59:08', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":225,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(282, 18, 'Menambahkan barang baru: Kursi anak', '2025-12-06 14:59:28', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":226,\"jumlah\":\"15\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(283, 18, 'Menambahkan barang baru: Meja Plastik Persegi', '2025-12-06 14:59:48', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":227,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(284, 18, 'Menambahkan barang baru: Meja Panjang', '2025-12-06 15:00:15', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":228,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(285, 18, 'Menambahkan barang baru: Kantong persembahan', '2025-12-06 15:01:05', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":229,\"jumlah\":\"6\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(286, 18, 'Menambahkan barang baru: Rak Buku', '2025-12-06 15:01:26', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":230,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(287, 18, 'Menambahkan barang baru: LCD', '2025-12-06 15:01:53', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":231,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(288, 18, 'Menambahkan barang baru: Mic', '2025-12-06 15:02:15', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":232,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(289, 18, 'Menambahkan barang baru: Angklung', '2025-12-06 15:02:29', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":233,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(290, 18, 'Menambahkan barang baru: Boneka', '2025-12-06 15:03:28', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":234,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(291, 18, 'Menambahkan barang baru: Puzzle Lantai Alphabet', '2025-12-06 15:03:57', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":235,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(292, 18, 'Menambahkan barang baru: Puzzle', '2025-12-06 15:04:23', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":236,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(293, 18, 'Menambahkan barang baru: Bola Kecil', '2025-12-06 15:04:37', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":237,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(294, 18, 'Menambahkan barang baru: Krayon', '2025-12-06 15:05:04', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":238,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(295, 18, 'Menambahkan barang baru: Kertas lipat', '2025-12-06 15:05:41', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":239,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(296, 18, 'Menambahkan barang baru: Telur Plastik', '2025-12-06 15:05:59', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":240,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(297, 18, 'Menambahkan barang baru: APE Tatakan Kelereng', '2025-12-06 15:06:22', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":241,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(298, 18, 'Menambahkan barang baru: Kertas HVS', '2025-12-06 15:06:38', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":242,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(299, 18, 'Menambahkan barang baru: Kertas Krep', '2025-12-06 15:07:20', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":243,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(300, 18, 'Menambahkan barang baru: Bolpoint', '2025-12-06 15:07:35', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":244,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(301, 18, 'Menambahkan barang baru: Lem', '2025-12-06 15:07:55', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":245,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(302, 18, 'Menambahkan barang baru: Gunting', '2025-12-06 15:08:19', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":246,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}');
INSERT INTO `aktivitas` (`id`, `user_id`, `aktivitas`, `waktu`, `ip_address`, `user_agent`, `meta`) VALUES
(303, 18, 'Menambahkan barang baru: Kostum Pakaian Adat Anak', '2025-12-06 15:08:36', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":247,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(304, 18, 'Menambahkan barang baru: Kostum Pakaian Adat Dewasa', '2025-12-06 15:09:00', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":248,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(305, 18, 'Menambahkan barang baru: Akesoris', '2025-12-06 15:09:14', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":249,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(306, 18, 'Menambahkan barang baru: Kipas Angin warna merah', '2025-12-06 15:10:02', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":250,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(307, 18, 'Menambahkan barang baru: Electone Yamaha', '2025-12-06 15:11:05', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":251,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(308, 18, 'Menambahkan barang baru: Sound System', '2025-12-06 15:11:25', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":252,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(309, 20, 'Menambahkan barang baru: Alkitab besar Bahasa Indonesia', '2025-12-06 16:19:30', '110.137.101.139', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":253,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(310, 10, 'Menambahkan barang baru: G', '2025-12-06 16:51:49', '110.137.101.139', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":254,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(311, 1, 'Menghapus barang: G', '2025-12-06 16:52:48', '110.137.101.139', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":254,\"keterangan\":\"Menghapus aset dari inventaris\"}'),
(312, 1, 'Menghapus peminjaman barang ID: 22', '2025-12-06 17:12:03', '114.5.103.178', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Peminjaman\",\"record_id\":22,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Menghapus data peminjaman\"}'),
(313, 1, 'Membuat peminjaman barang: alat cek gula darah', '2025-12-06 17:12:18', '114.5.103.178', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":23,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Mencatat peminjaman barang ke Tian\"}'),
(314, 10, 'Melakukan mutasi barang: LEMARI dari H ke K', '2025-12-06 17:16:39', '114.5.103.178', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Mutasi\",\"record_id\":11,\"keterangan\":\"Memindahkan aset ke lokasi baru: K\"}'),
(315, 10, 'Membuat peminjaman barang: LEMARI', '2025-12-06 17:36:58', '110.137.100.10', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Peminjaman\",\"record_id\":24,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Mencatat peminjaman barang ke R\"}'),
(316, 1, 'Mengembalikan barang peminjaman: alat cek gula darah', '2025-12-06 19:11:57', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":23,\"jumlah_dikembalikan\":\"1\",\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(317, 1, 'Mengembalikan barang peminjaman: LEMARI', '2025-12-06 19:12:02', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"kembalikan\",\"model\":\"Peminjaman\",\"record_id\":24,\"jumlah_dikembalikan\":\"1\",\"keterangan\":\"Barang dikembalikan ke inventaris\"}'),
(318, 1, 'Menghapus peminjaman barang ID: 23', '2025-12-06 19:12:07', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"destroy\",\"model\":\"Peminjaman\",\"record_id\":23,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Menghapus data peminjaman\"}'),
(319, 1, 'Menghapus peminjaman barang ID: 24', '2025-12-06 19:12:10', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"destroy\",\"model\":\"Peminjaman\",\"record_id\":24,\"jumlah_dipinjam\":\"1\",\"keterangan\":\"Menghapus data peminjaman\"}'),
(320, 15, 'Menambahkan barang baru: Kabel Roll 6 Slot', '2025-12-06 19:14:37', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":255,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(321, 1, 'Menghapus mutasi barang: LEMARI', '2025-12-06 19:21:47', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"destroy\",\"model\":\"Mutasi\",\"record_id\":11,\"keterangan\":\"Menghapus data mutasi barang\"}'),
(322, 17, 'Menambahkan barang baru: Termos air panas', '2025-12-06 19:50:46', '182.5.237.149', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":256,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(323, 10, 'Menambahkan barang baru: Kursi', '2025-12-06 19:52:54', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":257,\"jumlah\":\"20\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(324, 17, 'Menambahkan barang baru: Magic Com', '2025-12-06 19:53:56', '182.5.237.149', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":258,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(325, 10, 'Menambahkan barang baru: Kipas Angin', '2025-12-06 20:00:35', '110.137.100.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":259,\"jumlah\":\"2\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(326, 18, 'Melakukan mutasi barang: Mic dari KPAR( POSISI DI PAK MINTO) ke Kppl', '2025-12-06 20:04:35', '182.5.239.91', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Mutasi\",\"record_id\":12,\"keterangan\":\"Memindahkan aset ke lokasi baru: Kppl\"}'),
(327, 18, 'Melakukan mutasi barang: Sound System dari KPAR ( aula bawah) ke KPPL', '2025-12-06 20:11:13', '182.5.239.91', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Mutasi\",\"record_id\":13,\"keterangan\":\"Memindahkan aset ke lokasi baru: KPPL\"}'),
(328, 1, 'Menghapus komisi: Komisi Administrasi', '2025-12-13 06:34:30', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":33,\"nama_komisi\":\"Komisi Administrasi\"}'),
(329, 1, 'Menghapus komisi: Komisi Dapur Umum', '2025-12-13 06:34:37', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":40,\"nama_komisi\":\"Komisi Dapur Umum\"}'),
(330, 1, 'Menghapus komisi: Komisi Anak', '2025-12-13 06:34:41', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":39,\"nama_komisi\":\"Komisi Anak\"}'),
(331, 1, 'Menghapus komisi: Komisi Pemuda', '2025-12-13 06:34:46', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":38,\"nama_komisi\":\"Komisi Pemuda\"}'),
(332, 1, 'Menghapus komisi: Komisi Sosial', '2025-12-13 06:34:50', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":37,\"nama_komisi\":\"Komisi Sosial\"}'),
(333, 1, 'Menghapus komisi: Komisi Keuangan', '2025-12-13 06:34:55', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":36,\"nama_komisi\":\"Komisi Keuangan\"}'),
(334, 1, 'Menghapus komisi: Komisi Musik', '2025-12-13 06:34:59', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":35,\"nama_komisi\":\"Komisi Musik\"}'),
(335, 1, 'Menghapus komisi: Komisi Pelayanan', '2025-12-13 06:35:03', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Komisi\",\"record_id\":34,\"nama_komisi\":\"Komisi Pelayanan\"}'),
(336, 1, 'Menambahkan komisi baru: Sekretariat', '2025-12-13 06:35:14', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Komisi\",\"record_id\":41,\"nama_komisi\":\"Sekretariat\",\"keterangan\":null}'),
(337, 1, 'Menambahkan pengguna baru: Sekretariat', '2025-12-13 06:35:54', '110.137.100.15', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"User\",\"user_id\":22,\"username\":\"sekretariat\",\"role\":\"Komisi\",\"keterangan\":\"Menambahkan pengguna sistem\"}'),
(338, 10, 'Menambahkan barang baru: U', '2025-12-20 01:35:33', '36.74.184.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":261,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(339, 2, 'Menghapus barang: U', '2025-12-20 01:36:10', '36.74.184.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":261,\"keterangan\":\"Menghapus aset dari inventaris\"}'),
(340, 2, 'Menghapus barang: F', '2025-12-20 01:36:38', '36.74.184.2', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"destroy\",\"model\":\"Barang\",\"record_id\":260,\"keterangan\":\"Menghapus aset dari inventaris\"}'),
(341, 18, 'Menambahkan barang baru: Kipas Dinding', '2025-12-20 05:22:23', '114.5.222.227', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":262,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(342, 18, 'Menambahkan barang baru: Kursi Plastik', '2025-12-20 05:36:08', '114.5.222.227', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":263,\"jumlah\":\"22\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(343, 9, 'Menambahkan barang baru: Peralatan Pemandian', '2025-12-22 15:53:19', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":264,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(344, 9, 'Menambahkan barang baru: Penutup Kain Hijau', '2025-12-22 15:54:32', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":265,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(345, 9, 'Menambahkan barang baru: Gergaji', '2025-12-22 15:55:37', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":266,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(346, 9, 'Menambahkan barang baru: Bor', '2025-12-22 15:56:43', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":267,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(347, 9, 'Menambahkan barang baru: Gerendra', '2025-12-22 15:57:31', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":268,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(348, 9, 'Menambahkan barang baru: Inverter', '2025-12-22 15:58:39', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":269,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(349, 9, 'Menambahkan barang baru: Obeng', '2025-12-22 15:59:19', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":270,\"jumlah\":\"5\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(350, 9, 'Menambahkan barang baru: Palu', '2025-12-22 16:00:03', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":271,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(351, 9, 'Menambahkan barang baru: Pahat', '2025-12-22 16:00:47', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":272,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(352, 9, 'Menambahkan barang baru: Gunting', '2025-12-22 16:01:33', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":273,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(353, 9, 'Menambahkan barang baru: Peralatan Bor', '2025-12-22 16:06:34', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":274,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(354, 9, 'Menambahkan barang baru: Kain Hitam Putih', '2025-12-22 16:07:41', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":275,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(355, 9, 'Menambahkan barang baru: Kursi Peti', '2025-12-22 16:08:26', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":276,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(356, 9, 'Menambahkan barang baru: Tali Tampar Peti', '2025-12-22 16:09:11', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":277,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(357, 9, 'Menambahkan barang baru: Papan Pengumunan', '2025-12-22 16:10:20', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":278,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(358, 9, 'Menambahkan barang baru: Kotak Sumbangan Keluarga Duka', '2025-12-22 16:11:11', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":279,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(359, 9, 'Menambahkan barang baru: Bendera Pangruti', '2025-12-22 16:11:50', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":280,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(360, 9, 'Menambahkan barang baru: Keranjang Bunga', '2025-12-22 16:23:28', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":281,\"jumlah\":\"5\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(361, 9, 'Menambahkan barang baru: Etalase bentuk L', '2025-12-22 16:24:56', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":282,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(362, 9, 'Menambahkan barang baru: Lemari Pangruti', '2025-12-22 16:25:41', '110.137.102.162', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":283,\"jumlah\":\"3\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(363, 9, 'Menambahkan barang baru: Kipas Angin', '2025-12-29 06:25:48', '110.137.100.199', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":284,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(364, 9, 'Menambahkan barang baru: Tas Emergency', '2025-12-29 06:28:08', '110.137.100.199', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '{\"action\":\"store\",\"model\":\"Barang\",\"record_id\":285,\"jumlah\":\"1\",\"keterangan\":\"Menambahkan barang baru ke inventaris\"}'),
(365, 10, 'User logged in', '2026-02-06 23:51:09', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(366, 1, 'User logged in', '2026-02-06 23:51:20', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(367, 1, 'User logged in', '2026-02-06 23:51:22', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(368, 1, 'User logged in', '2026-02-06 23:51:48', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(369, 10, 'User logged in', '2026-02-06 23:51:52', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(370, 1, 'User logged in', '2026-02-06 23:51:55', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(371, 1, 'User logged in', '2026-02-06 23:53:33', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(372, 1, 'User logged in', '2026-02-06 23:54:04', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(373, 1, 'User logged in', '2026-02-06 23:54:06', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(374, 1, 'User logged in', '2026-02-06 23:54:55', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(375, 1, 'User logged in', '2026-02-06 23:58:09', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(376, 1, 'User logged in', '2026-02-06 23:58:28', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(377, 1, 'User logged in', '2026-02-06 23:58:30', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(378, 10, 'User logged in', '2026-02-06 23:59:58', '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(379, 22, 'User logged in', '2026-02-07 20:03:45', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(380, 10, 'User logged in', '2026-02-07 20:05:05', '110.137.103.163', 'Mozilla/5.0 (Linux; Android 15; V2419) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/123.0.6312.118 Mobile Safari/537.36 VivoBrowser/15.1.0.4', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(381, 22, 'User logged out', '2026-02-07 20:11:51', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"logout\",\"keterangan\":\"User initiated logout\"}'),
(382, 10, 'User logged in', '2026-02-07 20:11:56', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(383, 10, 'User logged out', '2026-02-07 20:41:01', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"logout\",\"keterangan\":\"User initiated logout\"}'),
(384, 10, 'User logged in', '2026-02-07 20:41:35', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(385, 10, 'User logged out', '2026-02-07 20:52:56', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"logout\",\"keterangan\":\"User initiated logout\"}'),
(386, 10, 'User logged in', '2026-02-07 20:53:00', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(387, 10, 'User logged in', '2026-02-08 00:57:07', '110.137.103.0', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(388, 10, 'User logged in', '2026-02-08 05:35:20', '110.137.103.163', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(389, 10, 'User logged in', '2026-02-08 18:51:08', '36.74.138.63', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(390, 10, 'User logged in', '2026-02-08 19:50:46', '36.74.138.63', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(391, 10, 'User logged in', '2026-02-08 22:19:03', '110.137.103.147', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(392, 10, 'User logged in', '2026-02-10 22:21:02', '36.74.133.121', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(393, 10, 'User logged out', '2026-02-10 22:21:46', '36.74.133.121', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"logout\",\"keterangan\":\"User initiated logout\"}'),
(394, 10, 'User logged in', '2026-02-10 22:21:49', '36.74.133.121', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(395, 10, 'User logged out', '2026-02-10 22:21:53', '36.74.133.121', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"logout\",\"keterangan\":\"User initiated logout\"}'),
(396, 10, 'User logged in', '2026-02-10 22:22:57', '36.74.133.121', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(397, 10, 'User logged in', '2026-02-13 18:44:50', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(398, 10, 'User logged in', '2026-02-13 18:45:32', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(399, 10, 'User logged in', '2026-02-14 00:56:33', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(400, 10, 'User logged in', '2026-02-14 00:58:18', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(401, 10, 'User logged in', '2026-02-14 01:13:22', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(402, 10, 'User logged in', '2026-02-14 01:17:26', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(403, 10, 'User logged out', '2026-02-14 01:20:47', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"logout\",\"keterangan\":\"User initiated logout\"}'),
(404, 10, 'User logged in', '2026-02-14 01:23:43', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(405, 10, 'User logged in', '2026-02-14 01:38:16', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}'),
(406, 10, 'User logged in', '2026-02-14 01:43:25', '110.137.103.168', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '{\"action\":\"login\",\"keterangan\":\"Successful login\"}');

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id_barang` bigint(20) UNSIGNED NOT NULL,
  `kode_barang` varchar(255) NOT NULL,
  `nama_barang` varchar(255) NOT NULL,
  `komisi_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `spesifikasi` text DEFAULT NULL,
  `kondisi` enum('Baik','Rusak','Hilang') NOT NULL DEFAULT 'Baik',
  `lokasi` varchar(255) NOT NULL,
  `tanggal_perolehan` date NOT NULL,
  `sumber_perolehan` varchar(255) NOT NULL,
  `harga_perolehan` decimal(15,2) NOT NULL,
  `foto_barang` varchar(255) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `status` enum('Aktif','Nonaktif') NOT NULL DEFAULT 'Aktif',
  `jumlah` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id_barang`, `kode_barang`, `nama_barang`, `komisi_id`, `user_id`, `spesifikasi`, `kondisi`, `lokasi`, `tanggal_perolehan`, `sumber_perolehan`, `harga_perolehan`, `foto_barang`, `qr_code`, `status`, `jumlah`, `created_at`, `updated_at`) VALUES
(56, 'BRG-20251112-002', 'Lemari obat-obatan', 11, NULL, 'Metformin, Piroxicam, Amoxicilin, Lodia, simvastatin 10 mg, simvastatin 20 mg, Histigo (betahistin), Demacolin, Asam Mefenamat, Meloxicam 7,5 mg, sodium diclofenac, Alleron (Orphen) Amlodipin 10 mg, Amlodipin 5 mg, Antasida Doen Allopurinol 100 mg, omeprazole, Neurobion, Vitamin C, Vitamin B1, Paracetamol, Dextral, Calcifar, Caviplex, Dexametason, Candesartan, Clopidogrel, Gabapentin, Fenofibrtate, domperidon, dexanta, ibuprofen, sucralfate syrup, valsartan', 'Baik', 'apotik ruang kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_56.png', 'Aktif', 1, '2025-11-12 06:42:39', '2025-11-13 00:23:31'),
(57, 'BRG-20251113-003', 'Tensimeter Raksa', 11, NULL, NULL, 'Rusak', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_57.png', 'Nonaktif', 1, '2025-11-13 00:25:33', '2025-11-13 00:27:04'),
(58, 'BRG-20251113-004', 'Tensi clock', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_58.png', 'Aktif', 1, '2025-11-13 00:26:41', '2025-11-13 00:26:42'),
(59, 'BRG-20251113-005', 'Stethoscope', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_59.png', 'Aktif', 4, '2025-11-13 00:44:38', '2025-11-13 00:44:39'),
(60, 'BRG-20251113-006', 'alat cek gula darah', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_60.png', 'Aktif', 3, '2025-11-13 00:45:38', '2025-12-06 19:11:57'),
(61, 'BRG-20251113-007', 'alat hand sanitizer otomatis', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_61.png', 'Aktif', 1, '2025-11-13 00:46:21', '2025-11-13 00:46:22'),
(62, 'BRG-20251113-008', 'alat hand sanitizer tembak', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_62.png', 'Aktif', 1, '2025-11-13 00:47:09', '2025-11-13 00:47:10'),
(63, 'BRG-20251113-009', 'Termogun', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_63.png', 'Aktif', 1, '2025-11-13 00:47:45', '2025-11-13 00:47:46'),
(64, 'BRG-20251113-010', 'Termogun Otomatis', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_64.png', 'Aktif', 4, '2025-11-13 00:48:38', '2025-11-13 00:48:39'),
(65, 'BRG-20251113-011', 'Kruk kaki 1', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_65.png', 'Aktif', 1, '2025-11-13 00:49:26', '2025-11-13 00:49:27'),
(66, 'BRG-20251113-012', 'Kruk Kaki 3', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_66.png', 'Aktif', 1, '2025-11-13 00:50:24', '2025-11-13 00:50:25'),
(67, 'BRG-20251113-013', 'Kruk Kaki 4', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_67.png', 'Aktif', 1, '2025-11-13 00:51:15', '2025-11-13 00:51:15'),
(68, 'BRG-20251113-014', 'Meja dan taplak', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_68.png', 'Aktif', 3, '2025-11-13 00:52:29', '2025-11-13 00:52:30'),
(69, 'BRG-20251113-015', 'kursi biru', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_69.png', 'Aktif', 10, '2025-11-13 00:53:24', '2025-11-13 00:53:25'),
(70, 'BRG-20251113-016', 'Etalase', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_70.png', 'Aktif', 3, '2025-11-13 00:56:50', '2025-11-13 00:56:51'),
(71, 'BRG-20251113-017', 'Meja Panjang', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_71.png', 'Aktif', 2, '2025-11-13 00:57:44', '2025-11-13 00:57:45'),
(72, 'BRG-20251113-018', 'Kursi Sofa', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_72.png', 'Aktif', 1, '2025-11-13 01:00:17', '2025-11-13 01:00:18'),
(73, 'BRG-20251113-019', 'Tempat tidur (Dipan)', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_73.png', 'Aktif', 1, '2025-11-13 01:01:19', '2025-11-13 01:01:20'),
(74, 'BRG-20251113-020', 'Kasur', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_74.png', 'Aktif', 2, '2025-11-13 01:02:03', '2025-11-13 01:02:04'),
(75, 'BRG-20251113-021', 'kulkas', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_75.png', 'Aktif', 1, '2025-11-13 01:02:50', '2025-11-13 01:02:52'),
(76, 'BRG-20251113-022', 'timbangan digital', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_76.png', 'Aktif', 1, '2025-11-13 01:03:32', '2025-11-13 01:03:33'),
(77, 'BRG-20251113-023', 'Timbangan manual', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_77.png', 'Aktif', 1, '2025-11-13 01:04:21', '2025-11-13 01:04:22'),
(78, 'BRG-20251113-024', 'Tempat Sampah', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_78.png', 'Aktif', 1, '2025-11-13 01:05:03', '2025-11-13 01:05:04'),
(79, 'BRG-20251113-025', 'Tensi digital', 11, NULL, NULL, 'Baik', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_79.png', 'Aktif', 1, '2025-11-13 01:20:00', '2025-11-13 01:20:01'),
(80, 'BRG-20251113-026', 'Tensi digital', 11, NULL, NULL, 'Rusak', 'Ruang pemeriksaan kesehatan', '2025-01-24', 'beli', 0.00, NULL, 'qrcodes/barang_80.png', 'Aktif', 1, '2025-11-13 01:20:33', '2025-11-13 01:20:34'),
(81, 'BRG-20251113-027', 'Buku Resume PKT & ORTALA 2022', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_81.png', 'Aktif', 2, '2025-11-13 04:33:31', '2025-11-13 04:33:32'),
(82, 'BRG-20251113-028', 'Buku Resume PKT 2024', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_82.png', 'Aktif', 3, '2025-11-13 04:34:51', '2025-11-13 04:34:53'),
(83, 'BRG-20251113-029', 'Buku Hasil Rembug Warga 2022', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_83.png', 'Aktif', 21, '2025-11-13 04:36:41', '2025-11-13 04:36:43'),
(84, 'BRG-20251113-030', 'Buku ORTALA 2022-2024', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_84.png', 'Aktif', 3, '2025-11-13 04:38:55', '2025-11-13 04:38:56'),
(85, 'BRG-20251113-031', 'Buku PKT 2022 Komisi', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_85.png', 'Aktif', 10, '2025-11-13 04:39:42', '2025-11-13 04:39:44'),
(86, 'BRG-20251113-032', 'Buku PKT 2022 Non Komisi', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_86.png', 'Aktif', 1, '2025-11-13 04:40:37', '2025-11-13 04:40:38'),
(87, 'BRG-20251113-033', 'Buku PKT 2023 Non Komisi', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_87.png', 'Aktif', 1, '2025-11-13 04:41:23', '2025-11-13 04:41:24'),
(88, 'BRG-20251113-034', 'Buku PKT 2024 Komisi', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_88.png', 'Aktif', 2, '2025-11-13 04:42:11', '2025-11-13 04:42:13'),
(89, 'BRG-20251113-035', 'Buku PKT 2024 Non Komisi', 21, NULL, '-', 'Baik', '-', '2025-02-09', 'Pembelian', 0.00, NULL, 'qrcodes/barang_89.png', 'Aktif', 1, '2025-11-13 04:43:14', '2025-11-13 04:43:15'),
(91, 'BAR-112025-001', 'Piring bambu', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_91.png', 'Aktif', 89, '2025-11-15 05:17:29', '2025-11-15 05:17:30'),
(92, 'BAR-112025-000', 'Teko 2L', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_92.png', 'Aktif', 2, '2025-11-15 05:18:04', '2025-11-15 05:18:04'),
(97, 'BAR-112025-002', 'Teko 1L', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_97.png', 'Aktif', 2, '2025-11-15 06:21:45', '2025-11-15 06:23:09'),
(98, 'BAR-112025-003', 'Cool tank besar', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_98.png', 'Aktif', 2, '2025-11-15 06:22:22', '2025-11-15 06:22:23'),
(99, 'BAR-112025-004', 'KIPAS ANGIN', 9, NULL, '-', 'Baik', 'Kapanditan', '2025-01-01', '-', 0.00, NULL, 'qrcodes/barang_99.png', 'Aktif', 3, '2025-11-15 06:27:04', '2025-12-06 12:05:27'),
(100, 'BAR-112025-005', 'MEJA', 9, NULL, '-', 'Baik', 'Kapanditan', '2025-01-01', '-', 0.00, NULL, 'qrcodes/barang_100.png', 'Aktif', 4, '2025-11-15 06:27:47', '2025-11-15 06:27:48'),
(101, 'BAR-112025-006', 'KURSI', 9, NULL, '-', 'Baik', 'Kapanditan', '2025-01-01', '-', 0.00, NULL, 'qrcodes/barang_101.png', 'Aktif', 4, '2025-11-15 06:28:50', '2025-11-15 06:28:51'),
(102, 'BAR-112025-007', 'Kamar Tidur', 9, NULL, '-', 'Baik', 'Kapanditan', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_102.png', 'Aktif', 4, '2025-11-15 06:29:22', '2025-12-06 12:23:22'),
(103, 'BAR-112025-008', 'LEMARI', 9, NULL, '-', 'Baik', 'K', '2025-01-01', '-', 0.00, NULL, 'qrcodes/barang_103.png', 'Aktif', 1, '2025-11-15 06:30:13', '2025-12-06 19:12:02'),
(104, 'BAR-112025-009', 'Cool tank kecil', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_104.png', 'Aktif', 2, '2025-11-15 06:34:54', '2025-11-15 06:34:57'),
(105, 'BAR-112025-010', 'Piring makan umum', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_105.png', 'Aktif', 300, '2025-11-15 06:35:44', '2025-11-15 07:16:31'),
(106, 'BAR-112025-011', 'Piring makan putih polos', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_106.png', 'Aktif', 36, '2025-11-15 06:41:52', '2025-11-15 06:41:53'),
(107, 'BAR-112025-012', 'Piring makan motif campur', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_107.png', 'Aktif', 37, '2025-11-15 07:13:06', '2025-11-15 07:13:07'),
(108, 'BAR-112025-013', 'Kursi Jemaat', 9, NULL, NULL, 'Baik', 'Gedung Gereja', '2025-12-31', 'Pembelian', 0.00, NULL, 'qrcodes/barang_108.png', 'Aktif', 61, '2025-11-15 18:39:05', '2025-12-31 18:08:02'),
(109, 'BAR-112025-014', 'Kipas Angin', 9, NULL, '-', 'Baik', 'Gedung Gereja', '2025-11-16', 'Pembelian', 0.00, NULL, 'qrcodes/barang_109.png', 'Aktif', 12, '2025-11-15 18:40:11', '2025-11-15 18:40:48'),
(110, 'BAR-112025-015', 'Kursi tanpa sandaran', 9, NULL, '-', 'Baik', 'Gedung Gereja', '2025-11-16', 'Pembelian', 0.00, NULL, 'qrcodes/barang_110.png', 'Aktif', 4, '2025-11-15 18:43:51', '2025-11-15 18:43:52'),
(111, 'BAR-112025-016', 'Jam Dinding', 9, NULL, '-', 'Baik', 'Gedung Gereja', '2025-11-16', 'Pembelian', 0.00, NULL, 'qrcodes/barang_111.png', 'Aktif', 1, '2025-11-15 18:45:52', '2025-11-15 18:45:52'),
(112, 'BAR-112025-017', 'Sepatu Boot', 22, NULL, NULL, 'Baik', 'Gereja', '2025-01-20', 'beli', 0.00, NULL, 'qrcodes/barang_112.png', 'Aktif', 6, '2025-11-18 01:14:30', '2025-11-18 01:14:31'),
(113, 'BAR-112025-018', 'Uang tunai', 22, NULL, 'Senilai 4.295.000', 'Baik', 'BP Tanggul Bencana', '2025-01-20', '0', 0.00, NULL, 'qrcodes/barang_113.png', 'Aktif', 1, '2025-11-18 01:18:50', '2025-11-18 01:18:51'),
(114, 'BAR-112025-019', 'Sendok kecil', 26, NULL, NULL, 'Baik', '-', '2025-11-22', 'pembelian', 0.00, NULL, 'qrcodes/barang_114.png', 'Aktif', 70, '2025-11-21 17:26:37', '2025-11-21 17:26:38'),
(115, 'BAR-122025-001', 'Kipas Angin', 9, NULL, 'Regency 15 watt', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_115.png', 'Aktif', 1, '2025-12-06 12:05:00', '2025-12-06 12:05:01'),
(116, 'BAR-122025-002', 'Stop Kontak Isi 4', 9, NULL, NULL, 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_116.png', 'Aktif', 1, '2025-12-06 12:06:22', '2025-12-06 12:06:22'),
(117, 'BAR-122025-003', 'Stop Kontak T', 9, NULL, NULL, 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_117.png', 'Aktif', 1, '2025-12-06 12:07:47', '2025-12-06 12:07:47'),
(118, 'BAR-122025-004', 'VGA Splitter', 9, NULL, '4 Port', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_118.png', 'Aktif', 1, '2025-12-06 12:16:46', '2025-12-06 12:16:48'),
(119, 'BAR-122025-005', 'Lonceng', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_119.png', 'Aktif', 1, '2025-12-06 12:19:23', '2025-12-06 12:19:24'),
(120, 'BAR-122025-006', 'Lonceng', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_120.png', 'Aktif', 1, '2025-12-06 12:19:24', '2025-12-06 12:19:25'),
(121, 'BAR-122025-007', 'Lampu Neon Isi 1', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_121.png', 'Aktif', 2, '2025-12-06 12:19:56', '2025-12-06 12:19:57'),
(122, 'BAR-122025-008', 'Stand Speaker', 9, NULL, '-', 'Baik', 'Ruang Kebaktian-Balkon', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_122.png', 'Aktif', 2, '2025-12-06 12:20:32', '2025-12-06 12:21:12'),
(123, 'BAR-122025-009', 'Stand Speaker', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_123.png', 'Aktif', 2, '2025-12-06 12:21:38', '2025-12-06 12:21:39'),
(124, 'BAR-122025-010', 'Stand Book', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_124.png', 'Aktif', 2, '2025-12-06 12:22:37', '2025-12-06 12:22:37'),
(125, 'BAR-122025-011', 'Rumah Lampu', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_125.png', 'Aktif', 2, '2025-12-06 12:23:58', '2025-12-06 12:23:58'),
(126, 'BAR-122025-012', 'Speaker', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_126.png', 'Aktif', 1, '2025-12-06 12:24:58', '2025-12-06 12:24:59'),
(127, 'BAR-122025-013', 'R.Multimedia', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_127.png', 'Aktif', 1, '2025-12-06 12:25:35', '2025-12-06 12:25:36'),
(128, 'BAR-122025-014', 'Layar Proyektor', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_128.png', 'Aktif', 1, '2025-12-06 12:26:15', '2025-12-06 12:26:16'),
(129, 'BAR-122025-015', 'CCTV', 9, NULL, '-', 'Baik', 'Ruang Kebaktian', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_129.png', 'Aktif', 2, '2025-12-06 12:26:33', '2025-12-06 12:26:55'),
(130, 'BAR-122025-016', 'Meja Kayu', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_130.png', 'Aktif', 6, '2025-12-06 12:27:46', '2025-12-06 12:27:47'),
(131, 'BAR-122025-017', 'Meja Kayu Dengan Laci 6', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_131.png', 'Aktif', 1, '2025-12-06 12:28:23', '2025-12-06 12:28:46'),
(133, 'BAR-122025-018', 'Papan Pelayanan', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_133.png', 'Aktif', 1, '2025-12-06 12:30:30', '2025-12-06 12:30:31'),
(134, 'BAR-122025-019', 'Papan Jadwal Khotbah', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_134.png', 'Aktif', 1, '2025-12-06 12:32:29', '2025-12-06 12:32:30'),
(135, 'BAR-122025-020', 'Papan Jadwal Organis Song Leader', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_135.png', 'Aktif', 1, '2025-12-06 12:33:58', '2025-12-06 12:34:00'),
(136, 'BAR-122025-021', 'Papan Agenda Kegiatan', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_136.png', 'Aktif', 1, '2025-12-06 12:34:32', '2025-12-06 12:34:33'),
(137, 'BAR-122025-022', 'Cermin', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_137.png', 'Aktif', 1, '2025-12-06 12:35:58', '2025-12-06 12:35:58'),
(138, 'BAR-122025-023', 'Meja Tempat Dispenser', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_138.png', 'Aktif', 1, '2025-12-06 12:36:32', '2025-12-06 12:36:33'),
(139, 'BAR-122025-024', 'Dispenser Miyakot Galon', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_139.png', 'Aktif', 1, '2025-12-06 12:37:34', '2025-12-06 12:37:35'),
(140, 'BAR-122025-025', 'Dispenser Denpo 0', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_140.png', 'Aktif', 1, '2025-12-06 12:38:13', '2025-12-06 12:38:14'),
(141, 'BAR-122025-026', 'Kabel Roll Isi 2', 9, NULL, '12 cm', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_141.png', 'Aktif', 1, '2025-12-06 12:39:39', '2025-12-06 12:39:40'),
(142, 'BAR-122025-027', 'Monitor CCTV', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_142.png', 'Aktif', 1, '2025-12-06 12:40:14', '2025-12-06 12:40:15'),
(143, 'BAR-122025-028', 'Kotak Trafo CCTV', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_143.png', 'Aktif', 1, '2025-12-06 12:41:11', '2025-12-06 12:41:12'),
(144, 'BAR-122025-029', 'Kotak Visilink', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_144.png', 'Aktif', 1, '2025-12-06 12:41:55', '2025-12-06 12:41:56'),
(145, 'BAR-122025-030', 'Kotak Penghapus + Spidol', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_145.png', 'Aktif', 1, '2025-12-06 12:43:49', '2025-12-06 12:43:50'),
(146, 'BAR-122025-031', 'Lampu Neon Panjang', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_146.png', 'Aktif', 4, '2025-12-06 12:45:01', '2025-12-06 12:45:02'),
(147, 'BAR-122025-032', 'Figura + Foto Pendeta', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_147.png', 'Aktif', 8, '2025-12-06 12:45:39', '2025-12-06 12:45:40'),
(148, 'BAR-122025-033', 'Tempat Sampah', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_148.png', 'Aktif', 1, '2025-12-06 12:47:05', '2025-12-06 12:47:05'),
(149, 'BAR-122025-034', 'CCTV', 9, NULL, '-', 'Baik', 'Konsistori', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_149.png', 'Aktif', 1, '2025-12-06 12:47:35', '2025-12-06 12:47:36'),
(150, 'BAR-122025-035', 'Cermin', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_150.png', 'Aktif', 1, '2025-12-06 12:48:38', '2025-12-06 12:48:39'),
(151, 'BAR-122025-036', 'Tabung Apar', 9, NULL, 'Kapasitas 6 Kg Powder', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_151.png', 'Aktif', 1, '2025-12-06 12:49:15', '2025-12-06 12:49:16'),
(152, 'BAR-122025-037', 'Lemari Besi Hijau', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_152.png', 'Aktif', 1, '2025-12-06 12:49:44', '2025-12-06 12:49:45'),
(153, 'BAR-122025-038', 'Papan GKJW', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_153.png', 'Aktif', 1, '2025-12-06 12:50:22', '2025-12-06 12:50:23'),
(154, 'BAR-122025-039', 'Meja Dorong', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_154.png', 'Aktif', 1, '2025-12-06 12:50:55', '2025-12-06 12:50:55'),
(155, 'BAR-122025-040', 'Dispenser Sharp + Galon', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_155.png', 'Aktif', 1, '2025-12-06 12:51:37', '2025-12-06 12:51:38'),
(156, 'BAR-122025-041', 'Tatakan Dispenser Kaki 4', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_156.png', 'Aktif', 1, '2025-12-06 12:54:30', '2025-12-06 12:54:31'),
(157, 'BAR-122025-042', 'Tempat Sampah', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_157.png', 'Aktif', 1, '2025-12-06 12:55:07', '2025-12-06 12:55:08'),
(158, 'BAR-122025-043', 'Rak Galon & Peralatan Lainnya', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_158.png', 'Aktif', 1, '2025-12-06 12:55:43', '2025-12-06 12:55:44'),
(159, 'BAR-122025-044', 'Kipas Angin Duduk', 9, NULL, 'Kingston', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_159.png', 'Aktif', 1, '2025-12-06 12:56:10', '2025-12-06 12:56:11'),
(160, 'BAR-122025-045', 'Kipas Angin Maspion', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_160.png', 'Aktif', 1, '2025-12-06 12:56:41', '2025-12-06 12:56:42'),
(161, 'BAR-122025-046', 'Meja Kayu', 9, NULL, '150 x 50 cm', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_161.png', 'Aktif', 1, '2025-12-06 12:58:25', '2025-12-06 12:58:26'),
(162, 'BAR-122025-047', 'Jam Dinding', 9, NULL, NULL, 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_162.png', 'Aktif', 1, '2025-12-06 12:58:55', '2025-12-06 12:58:55'),
(163, 'BAR-122025-048', 'CCTV', 9, NULL, '-', 'Baik', 'Lorong Bawah', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_163.png', 'Aktif', 1, '2025-12-06 12:59:24', '2025-12-06 12:59:25'),
(164, 'BAR-122025-049', 'Tempat Sampah', 9, NULL, '-', 'Baik', 'Ruang Sekretariat', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_164.png', 'Aktif', 1, '2025-12-06 13:07:22', '2025-12-06 13:07:23'),
(165, 'BAR-122025-050', 'Peta Wilayah Warga', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-28', '-', 0.00, 'uploads/barang/1766896088_peta-wilayah-warga.png', 'qrcodes/barang_165.png', 'Aktif', 1, '2025-12-06 13:08:07', '2025-12-27 21:28:08'),
(166, 'BAR-122025-051', 'Rangka Besi Banner', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_166.png', 'Aktif', 1, '2025-12-06 13:09:02', '2025-12-06 13:09:03'),
(167, 'BAR-122025-052', 'Wastafel', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_167.png', 'Aktif', 2, '2025-12-06 13:09:35', '2025-12-06 13:09:36'),
(168, 'BAR-122025-053', 'Tempat Pemilah Sampah', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_168.png', 'Aktif', 2, '2025-12-06 13:11:46', '2025-12-06 13:11:47'),
(169, 'BAR-122025-054', 'Papan Pengumuman Aluminium', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_169.png', 'Aktif', 1, '2025-12-06 13:12:29', '2025-12-06 13:12:30'),
(170, 'BAR-122025-055', 'Koper Wadah Amplop', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_170.png', 'Aktif', 1, '2025-12-06 13:15:48', '2025-12-06 13:15:49'),
(171, 'BAR-122025-056', 'Dispenser + Galon', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_171.png', 'Aktif', 1, '2025-12-06 13:16:15', '2025-12-06 13:16:16'),
(172, 'BAR-122025-057', 'CCTV', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_172.png', 'Aktif', 5, '2025-12-06 13:17:05', '2025-12-06 13:17:06'),
(173, 'BAR-122025-058', 'Kursi Kayu Dengan Sandaran', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_173.png', 'Aktif', 1, '2025-12-06 13:17:32', '2025-12-06 13:17:33'),
(174, 'BAR-122025-059', 'Kursi Kayu Tanpa Sandaran', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_174.png', 'Aktif', 2, '2025-12-06 13:18:25', '2025-12-06 13:38:32'),
(175, 'BAR-122025-060', 'Meja Kayu Kotak Putih', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_175.png', 'Aktif', 1, '2025-12-06 13:36:53', '2025-12-06 13:36:53'),
(176, 'BAR-122025-061', 'Meja Kayu Kotak Dengan Roda', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_176.png', 'Aktif', 1, '2025-12-06 13:37:39', '2025-12-06 13:37:39'),
(177, 'BAR-122025-062', 'Tempat Sampah Plastik Anyaman', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_177.png', 'Aktif', 1, '2025-12-06 13:38:17', '2025-12-06 13:38:18'),
(178, 'BAR-122025-063', 'MCB', 9, NULL, '-', 'Baik', 'Halaman Gereja', '2025-12-07', '-', 0.00, NULL, 'qrcodes/barang_178.png', 'Aktif', 1, '2025-12-06 13:38:47', '2025-12-06 13:38:48'),
(179, 'BAR-122025-064', 'Sendok makan', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_179.png', 'Aktif', 192, '2025-12-06 14:26:17', '2025-12-06 14:29:12'),
(180, 'BAR-122025-065', 'Sendok teh panjang', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_180.png', 'Aktif', 3, '2025-12-06 14:26:42', '2025-12-06 14:29:43'),
(181, 'BAR-122025-066', 'Garpu', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_181.png', 'Aktif', 16, '2025-12-06 14:27:01', '2025-12-06 14:28:49'),
(182, 'BAR-122025-067', 'Gelas warna warni dalam boks putih', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_182.png', 'Aktif', 59, '2025-12-06 14:27:20', '2025-12-06 14:29:01'),
(183, 'BAR-122025-068', 'Centong sayur besar', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_183.png', 'Aktif', 3, '2025-12-06 14:27:52', '2025-12-06 14:29:24'),
(184, 'BAR-122025-069', 'Centong sayur kecil', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_184.png', 'Aktif', 3, '2025-12-06 14:28:13', '2025-12-06 14:29:33'),
(185, 'BAR-122025-070', 'Centong nasi', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_185.png', 'Aktif', 1, '2025-12-06 14:30:02', '2025-12-06 14:30:03'),
(186, 'BAR-122025-071', 'Japitan stainless kecil', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_186.png', 'Aktif', 2, '2025-12-06 14:30:23', '2025-12-06 14:30:24'),
(187, 'BAR-122025-072', 'Japitan stainless besar', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_187.png', 'Aktif', 4, '2025-12-06 14:32:20', '2025-12-06 14:32:21'),
(188, 'BAR-122025-073', 'Gelas piala', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_188.png', 'Aktif', 12, '2025-12-06 14:32:51', '2025-12-06 14:32:52'),
(189, 'BAR-122025-074', 'Tutup gelas piala', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_189.png', 'Aktif', 12, '2025-12-06 14:33:13', '2025-12-06 14:33:14'),
(190, 'BAR-122025-075', 'Piring puding ceper putih', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_190.png', 'Aktif', 20, '2025-12-06 14:33:33', '2025-12-06 14:33:33'),
(191, 'BAR-122025-076', 'Piring puding bening', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_191.png', 'Aktif', 36, '2025-12-06 14:34:19', '2025-12-06 14:34:19'),
(192, 'BAR-122025-077', 'Alat serbat', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_192.png', 'Aktif', 2, '2025-12-06 14:34:41', '2025-12-06 14:34:41'),
(193, 'BAR-122025-078', 'Tempat sayur kotak', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_193.png', 'Aktif', 3, '2025-12-06 14:35:08', '2025-12-06 14:35:09'),
(194, 'BAR-122025-079', 'Baki kayu besar', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_194.png', 'Aktif', 2, '2025-12-06 14:35:31', '2025-12-06 14:35:32'),
(195, 'BAR-122025-080', 'Gelas pendek rak 1', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_195.png', 'Aktif', 1, '2025-12-06 14:36:32', '2025-12-06 14:36:33'),
(196, 'BAR-122025-081', 'Gelas pendek rak 2', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_196.png', 'Aktif', 1, '2025-12-06 14:36:48', '2025-12-06 14:36:49'),
(197, 'BAR-122025-082', 'Gelas pendek rak 3', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_197.png', 'Aktif', 1, '2025-12-06 14:37:19', '2025-12-06 14:37:20'),
(198, 'BAR-122025-083', 'Gelas kaki rak 4', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_198.png', 'Aktif', 1, '2025-12-06 14:39:06', '2025-12-06 14:39:07'),
(199, 'BAR-122025-084', 'Gelas panjang rak 4', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_199.png', 'Aktif', 1, '2025-12-06 14:39:35', '2025-12-06 14:39:35'),
(200, 'BAR-122025-085', 'Gelas pendek rak 4', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_200.png', 'Aktif', 1, '2025-12-06 14:39:54', '2025-12-06 14:39:54'),
(201, 'BAR-122025-086', 'Gelas campur', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_201.png', 'Aktif', 61, '2025-12-06 14:40:32', '2025-12-06 14:40:33'),
(202, 'BAR-122025-087', 'Piring', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_202.png', 'Aktif', 234, '2025-12-06 14:41:15', '2025-12-06 14:41:16'),
(203, 'BAR-122025-088', 'Lepek', 26, NULL, '-', 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_203.png', 'Aktif', 6, '2025-12-06 14:41:43', '2025-12-06 14:41:44'),
(204, 'BAR-122025-089', 'Mangkok', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_204.png', 'Aktif', 3, '2025-12-06 14:43:01', '2025-12-06 14:43:02'),
(205, 'BAR-122025-090', 'Piring saji', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_205.png', 'Aktif', 2, '2025-12-06 14:43:28', '2025-12-06 14:43:29'),
(206, 'BAR-122025-091', 'Panel lorek', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_206.png', 'Aktif', 3, '2025-12-06 14:43:59', '2025-12-06 14:44:00'),
(207, 'BAR-122025-092', 'Tutup gelas', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_207.png', 'Aktif', 1, '2025-12-06 14:44:17', '2025-12-06 14:44:17'),
(208, 'BAR-122025-093', 'Nampan seng kecil', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_208.png', 'Aktif', 2, '2025-12-06 14:44:34', '2025-12-06 14:44:34'),
(209, 'BAR-122025-094', 'Tempeh plastik besar', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_209.png', 'Aktif', 4, '2025-12-06 14:44:58', '2025-12-06 14:44:58'),
(210, 'BAR-122025-095', 'Nampan plastik kecil', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_210.png', 'Aktif', 10, '2025-12-06 14:45:22', '2025-12-06 14:45:23'),
(211, 'BAR-122025-096', 'Taplak plastik coklat', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_211.png', 'Aktif', 2, '2025-12-06 14:45:58', '2025-12-06 14:45:59'),
(212, 'BAR-122025-097', 'Termos nasi', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_212.png', 'Aktif', 1, '2025-12-06 14:47:20', '2025-12-06 14:47:20'),
(213, 'BAR-122025-098', 'Teko bunyi', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_213.png', 'Aktif', 2, '2025-12-06 14:47:48', '2025-12-06 14:47:49'),
(214, 'BAR-122025-099', 'Termos air', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_214.png', 'Aktif', 1, '2025-12-06 14:48:47', '2025-12-06 14:48:48'),
(215, 'BAR-122025-100', 'Kompor gas 2 tungku', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_215.png', 'Aktif', 1, '2025-12-06 14:49:05', '2025-12-06 14:49:06'),
(216, 'BAR-122025-101', 'Tabung gas 12 kg', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_216.png', 'Aktif', 1, '2025-12-06 14:49:27', '2025-12-06 14:49:27'),
(217, 'BAR-122025-102', 'Galon', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_217.png', 'Aktif', 4, '2025-12-06 14:50:04', '2025-12-06 14:50:04'),
(218, 'BAR-122025-103', 'Dispenser', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_218.png', 'Aktif', 1, '2025-12-06 14:50:27', '2025-12-06 14:50:27'),
(219, 'BAR-122025-104', 'Tempat tisu', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_219.png', 'Aktif', 2, '2025-12-06 14:50:55', '2025-12-06 14:50:56'),
(220, 'BAR-122025-105', 'Tempat gelas air', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_220.png', 'Aktif', 1, '2025-12-06 14:51:36', '2025-12-06 14:51:37'),
(221, 'BAR-122025-106', 'Panel sayur ukuran kecil', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_221.png', 'Aktif', 1, '2025-12-06 14:51:57', '2025-12-06 14:51:58'),
(222, 'BAR-122025-107', 'Mangkok sayur coklat', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_222.png', 'Aktif', 1, '2025-12-06 14:55:48', '2025-12-06 14:55:49'),
(223, 'BAR-122025-108', 'Tempat makan utk PH', 26, NULL, NULL, 'Baik', '-', '2025-01-20', '-', 0.00, NULL, 'qrcodes/barang_223.png', 'Aktif', 11, '2025-12-06 14:56:57', '2025-12-06 14:56:58'),
(224, 'BAR-122025-109', 'Etalase', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_224.png', 'Aktif', 3, '2025-12-06 14:58:49', '2025-12-06 14:58:50'),
(225, 'BAR-122025-110', 'Etalase kecil', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_225.png', 'Aktif', 1, '2025-12-06 14:59:07', '2025-12-06 14:59:08'),
(226, 'BAR-122025-111', 'Kursi anak', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_226.png', 'Aktif', 15, '2025-12-06 14:59:27', '2025-12-06 14:59:28'),
(227, 'BAR-122025-112', 'Meja Plastik Persegi', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_227.png', 'Aktif', 3, '2025-12-06 14:59:47', '2025-12-06 14:59:48'),
(228, 'BAR-122025-113', 'Meja Panjang', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_228.png', 'Aktif', 1, '2025-12-06 15:00:14', '2025-12-06 15:00:15'),
(229, 'BAR-122025-114', 'Kantong persembahan', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_229.png', 'Aktif', 6, '2025-12-06 15:01:04', '2025-12-06 15:01:05'),
(230, 'BAR-122025-115', 'Rak Buku', 25, NULL, '-', 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_230.png', 'Aktif', 2, '2025-12-06 15:01:25', '2025-12-06 15:01:26'),
(231, 'BAR-122025-116', 'LCD', 25, NULL, NULL, 'Baik', '-', '2025-01-22', 'Donasi dari Bu Winarti', 0.00, NULL, 'qrcodes/barang_231.png', 'Aktif', 1, '2025-12-06 15:01:53', '2025-12-06 15:02:48'),
(232, 'BAR-122025-117', 'Mic', 25, NULL, NULL, 'Baik', 'Kppl', '2025-01-22', '0', 0.00, NULL, 'qrcodes/barang_232.png', 'Aktif', 2, '2025-12-06 15:02:14', '2025-12-06 20:04:35'),
(233, 'BAR-122025-118', 'Angklung', 25, NULL, NULL, 'Baik', '-', '2025-01-22', 'Donasi dari Bu Reni', 0.00, NULL, 'qrcodes/barang_233.png', 'Aktif', 1, '2025-12-06 15:02:28', '2025-12-06 15:02:59'),
(234, 'BAR-122025-119', 'Boneka', 25, NULL, NULL, 'Baik', 'Etalase aula bawa', '2025-07-13', 'Persembahan dari orang tua anak anak', 0.00, NULL, 'qrcodes/barang_234.png', 'Aktif', 20, '2025-12-06 15:03:27', '2025-12-06 19:57:02'),
(235, 'BAR-122025-120', 'Puzzle Lantai Alphabet', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_235.png', 'Aktif', 1, '2025-12-06 15:03:56', '2025-12-06 15:03:57'),
(236, 'BAR-122025-121', 'Puzzle', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_236.png', 'Aktif', 1, '2025-12-06 15:04:23', '2025-12-06 15:04:23'),
(237, 'BAR-122025-122', 'Bola Kecil', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_237.png', 'Aktif', 1, '2025-12-06 15:04:36', '2025-12-06 15:04:37'),
(238, 'BAR-122025-123', 'Krayon', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_238.png', 'Aktif', 1, '2025-12-06 15:05:04', '2025-12-06 15:05:04'),
(239, 'BAR-122025-124', 'Kertas lipat', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_239.png', 'Aktif', 1, '2025-12-06 15:05:40', '2025-12-06 15:05:41'),
(240, 'BAR-122025-125', 'Telur Plastik', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_240.png', 'Aktif', 1, '2025-12-06 15:05:58', '2025-12-06 15:05:59'),
(241, 'BAR-122025-126', 'APE Tatakan Kelereng', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_241.png', 'Aktif', 1, '2025-12-06 15:06:21', '2025-12-06 15:06:22'),
(242, 'BAR-122025-127', 'Kertas HVS', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_242.png', 'Aktif', 1, '2025-12-06 15:06:38', '2025-12-06 15:06:38'),
(243, 'BAR-122025-128', 'Kertas Krep', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_243.png', 'Aktif', 1, '2025-12-06 15:07:19', '2025-12-06 15:07:20'),
(244, 'BAR-122025-129', 'Bolpoint', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_244.png', 'Aktif', 1, '2025-12-06 15:07:35', '2025-12-06 15:07:35'),
(245, 'BAR-122025-130', 'Lem', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_245.png', 'Aktif', 1, '2025-12-06 15:07:55', '2025-12-06 15:07:55'),
(246, 'BAR-122025-131', 'Gunting', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_246.png', 'Aktif', 1, '2025-12-06 15:08:18', '2025-12-06 15:08:19'),
(247, 'BAR-122025-132', 'Kostum Pakaian Adat Anak', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_247.png', 'Aktif', 1, '2025-12-06 15:08:36', '2025-12-06 15:08:36'),
(248, 'BAR-122025-133', 'Kostum Pakaian Adat Dewasa', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_248.png', 'Aktif', 1, '2025-12-06 15:08:59', '2025-12-06 15:09:00'),
(249, 'BAR-122025-134', 'Akesoris', 25, NULL, NULL, 'Baik', '-', '2025-01-22', '-', 0.00, NULL, 'qrcodes/barang_249.png', 'Aktif', 1, '2025-12-06 15:09:13', '2025-12-06 15:09:14'),
(250, 'BAR-122025-135', 'Kipas Angin warna merah', 25, NULL, NULL, 'Baik', '-', '2025-01-22', 'Donasi dari lbu Winarti', 0.00, NULL, 'qrcodes/barang_250.png', 'Aktif', 1, '2025-12-06 15:10:01', '2025-12-06 15:10:02'),
(251, 'BAR-122025-136', 'Electone Yamaha', 25, NULL, NULL, 'Baik', '-', '2025-01-22', 'Donasi dari Bpk. Elwan', 0.00, NULL, 'qrcodes/barang_251.png', 'Aktif', 1, '2025-12-06 15:11:04', '2025-12-06 15:11:05'),
(252, 'BAR-122025-137', 'Sound System', 25, NULL, NULL, 'Baik', 'KPPL', '2025-01-22', 'Donasi dari Bpk. Elwan', 0.00, NULL, 'qrcodes/barang_252.png', 'Aktif', 1, '2025-12-06 15:11:24', '2025-12-06 20:11:13'),
(253, 'BAR-122025-138', 'Alkitab besar Bahasa Indonesia', 12, NULL, NULL, 'Baik', '-', '2025-01-03', '-', 0.00, NULL, 'qrcodes/barang_253.png', 'Aktif', 2, '2025-12-06 16:19:30', '2025-12-06 16:19:30'),
(255, 'BAR-122025-139', 'Kabel Roll 6 Slot', 28, NULL, NULL, 'Baik', '-', '2025-12-07', '-', 0.00, 'uploads/barang/1765073721_kabel-roll-6-slot.jpg', 'qrcodes/barang_255.png', 'Aktif', 1, '2025-12-06 19:14:36', '2025-12-06 19:15:21'),
(256, 'BAR-122025-140', 'Termos air panas', 26, NULL, NULL, 'Baik', 'Gudang/dapur', '2025-06-08', 'Donatur warga', 1100000.00, NULL, 'qrcodes/barang_256.png', 'Aktif', 2, '2025-12-06 19:50:45', '2025-12-06 19:50:46'),
(257, 'BAR-122025-141', 'Kursi', 9, NULL, '-', 'Baik', 'aula', '2025-12-07', 'hibah', 6000000.00, NULL, 'qrcodes/barang_257.png', 'Aktif', 20, '2025-12-06 19:52:53', '2025-12-06 19:52:54'),
(258, 'BAR-122025-142', 'Magic Com', 26, NULL, NULL, 'Baik', 'Dapur', '2025-12-07', 'Donatur warga', 250000.00, NULL, 'qrcodes/barang_258.png', 'Aktif', 1, '2025-12-06 19:53:55', '2025-12-06 19:53:56'),
(259, 'BAR-122025-143', 'Kipas Angin', 9, NULL, 'Sanyo', 'Baik', 'Gedung Gereja dan Aula', '2025-12-07', 'Hibah', 400000.00, NULL, 'qrcodes/barang_259.png', 'Aktif', 2, '2025-12-06 20:00:34', '2025-12-06 20:00:35'),
(262, 'BAR-122025-144', 'Kipas Dinding', 25, NULL, NULL, 'Baik', 'Kpar', '2025-12-20', 'Beli', 0.00, NULL, 'qrcodes/barang_262.png', 'Aktif', 3, '2025-12-20 05:22:23', '2025-12-20 05:22:23'),
(263, 'BAR-122025-145', 'Kursi Plastik', 25, NULL, NULL, 'Baik', 'Kpar', '2025-12-20', '-', 0.00, NULL, 'qrcodes/barang_263.png', 'Aktif', 22, '2025-12-20 05:36:07', '2025-12-20 05:36:08'),
(264, 'BAR-122025-146', 'Peralatan Pemandian', 11, NULL, 'Tenda 2 meter,\r\nMeja Panjang,\r\nKeranda,\r\nSelang,\r\nBantal,\r\nTong isi air', 'Baik', 'Gudang Diakonia', '2024-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_264.png', 'Aktif', 1, '2025-12-22 15:53:19', '2025-12-22 15:53:19'),
(265, 'BAR-122025-147', 'Penutup Kain Hijau', 11, NULL, 'Untuk memandikan jenazah, ukuran 6 x 2 meter', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_265.png', 'Aktif', 1, '2025-12-22 15:54:32', '2025-12-22 15:54:32'),
(266, 'BAR-122025-148', 'Gergaji', 11, NULL, 'Gergaji mesin/serkle', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_266.png', 'Aktif', 1, '2025-12-22 15:55:37', '2025-12-22 15:55:37'),
(267, 'BAR-122025-149', 'Bor', 11, NULL, 'Bor untuk membuat peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_267.png', 'Aktif', 1, '2025-12-22 15:56:43', '2025-12-22 15:56:43'),
(268, 'BAR-122025-150', 'Gerendra', 11, NULL, 'Mesin gerendra untuk membuat peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_268.png', 'Aktif', 1, '2025-12-22 15:57:31', '2025-12-22 15:57:31'),
(269, 'BAR-122025-151', 'Inverter', 11, NULL, 'Mesin Inverter untuk membuat peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia', 0.00, NULL, 'qrcodes/barang_269.png', 'Aktif', 1, '2025-12-22 15:58:39', '2025-12-22 15:58:39'),
(270, 'BAR-122025-152', 'Obeng', 11, NULL, 'Alat untuk membuat peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_270.png', 'Aktif', 5, '2025-12-22 15:59:18', '2025-12-22 15:59:19'),
(271, 'BAR-122025-153', 'Palu', 11, NULL, 'Alat untuk membuat peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonai 2024', 0.00, NULL, 'qrcodes/barang_271.png', 'Aktif', 1, '2025-12-22 16:00:02', '2025-12-22 16:00:03'),
(272, 'BAR-122025-154', 'Pahat', 11, NULL, 'Alat untuk membuat peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_272.png', 'Aktif', 1, '2025-12-22 16:00:47', '2025-12-22 16:00:47'),
(273, 'BAR-122025-155', 'Gunting', 11, NULL, 'Alat untuk membuat peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_273.png', 'Aktif', 1, '2025-12-22 16:01:33', '2025-12-22 16:21:57'),
(274, 'BAR-122025-156', 'Peralatan Bor', 11, NULL, 'Alat untuk membuat peti', 'Baik', 'Baik', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_274.png', 'Aktif', 1, '2025-12-22 16:06:33', '2025-12-22 16:06:34'),
(275, 'BAR-122025-157', 'Kain Hitam Putih', 11, NULL, 'Kain', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_275.png', 'Aktif', 1, '2025-12-22 16:07:41', '2025-12-22 16:07:41'),
(276, 'BAR-122025-158', 'Kursi Peti', 11, NULL, NULL, 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_276.png', 'Aktif', 1, '2025-12-22 16:08:26', '2025-12-22 16:08:26'),
(277, 'BAR-122025-159', 'Tali Tampar Peti', 11, NULL, 'Untuk menurunkan peti', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_277.png', 'Aktif', 1, '2025-12-22 16:09:10', '2025-12-22 16:09:11'),
(278, 'BAR-122025-160', 'Papan Pengumunan', 11, NULL, 'Papan untuk menuliskan berita kematian', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_278.png', 'Aktif', 1, '2025-12-22 16:10:20', '2025-12-22 16:10:20'),
(279, 'BAR-122025-161', 'Kotak Sumbangan Keluarga Duka', 11, NULL, 'Kotak', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_279.png', 'Aktif', 1, '2025-12-22 16:11:11', '2025-12-22 16:11:11'),
(280, 'BAR-122025-162', 'Bendera Pangruti', 11, NULL, 'Kain', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_280.png', 'Aktif', 2, '2025-12-22 16:11:50', '2025-12-22 16:22:38'),
(281, 'BAR-122025-163', 'Keranjang Bunga', 11, NULL, 'Keranjang Rotan tempat bunga tabur', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_281.png', 'Aktif', 5, '2025-12-22 16:23:28', '2025-12-22 16:23:28'),
(282, 'BAR-122025-164', 'Etalase bentuk L', 11, NULL, 'Etalase Kaca tempat menaruh bahan pemandian', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_282.png', 'Aktif', 1, '2025-12-22 16:24:55', '2025-12-22 16:24:56'),
(283, 'BAR-122025-165', 'Lemari Pangruti', 11, NULL, 'Lemari kayu', 'Baik', 'Gudang Diakonia', '2025-01-24', 'Diakonia 2024', 0.00, NULL, 'qrcodes/barang_283.png', 'Aktif', 3, '2025-12-22 16:25:40', '2025-12-22 16:25:41'),
(284, 'BAR-122025-166', 'Kipas Angin', 11, NULL, 'Maspion 14\" 37K', 'Baik', 'Balai Bina Kesehatan & Kesejahteraan Warga', '2025-10-17', 'Dana A', 325000.00, NULL, 'qrcodes/barang_284.png', 'Aktif', 1, '2025-12-29 06:25:47', '2025-12-29 06:25:48'),
(285, 'BAR-122025-167', 'Tas Emergency', 11, NULL, 'Merk Onemed', 'Baik', 'Balai Bina Kesehatan & Kesejahteraan Warga', '2025-09-16', 'Dana A', 182000.00, NULL, 'qrcodes/barang_285.png', 'Aktif', 1, '2025-12-29 06:28:07', '2025-12-29 06:28:08');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('siaset-gkjw-probolinggo-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:33:{i:0;a:4:{s:1:\"a\";s:1:\"1\";s:1:\"b\";s:14:\"view_dashboard\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:1;a:4:{s:1:\"a\";s:1:\"2\";s:1:\"b\";s:11:\"view_barang\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:2;a:4:{s:1:\"a\";s:1:\"3\";s:1:\"b\";s:13:\"create_barang\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:3;a:4:{s:1:\"a\";s:1:\"4\";s:1:\"b\";s:11:\"edit_barang\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:4;a:4:{s:1:\"a\";s:1:\"5\";s:1:\"b\";s:13:\"delete_barang\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:5;a:4:{s:1:\"a\";s:1:\"6\";s:1:\"b\";s:15:\"view_peminjaman\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:6;a:4:{s:1:\"a\";s:1:\"7\";s:1:\"b\";s:17:\"create_peminjaman\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:7;a:4:{s:1:\"a\";s:1:\"8\";s:1:\"b\";s:15:\"edit_peminjaman\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:8;a:4:{s:1:\"a\";s:1:\"9\";s:1:\"b\";s:17:\"delete_peminjaman\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:9;a:4:{s:1:\"a\";s:2:\"10\";s:1:\"b\";s:11:\"view_mutasi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:10;a:4:{s:1:\"a\";s:2:\"11\";s:1:\"b\";s:13:\"create_mutasi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:11;a:4:{s:1:\"a\";s:2:\"12\";s:1:\"b\";s:11:\"edit_mutasi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:12;a:4:{s:1:\"a\";s:2:\"13\";s:1:\"b\";s:13:\"delete_mutasi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:13;a:4:{s:1:\"a\";s:2:\"14\";s:1:\"b\";s:16:\"view_penghapusan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:14;a:4:{s:1:\"a\";s:2:\"15\";s:1:\"b\";s:18:\"create_penghapusan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:15;a:4:{s:1:\"a\";s:2:\"16\";s:1:\"b\";s:16:\"edit_penghapusan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:3;}}i:16;a:4:{s:1:\"a\";s:2:\"17\";s:1:\"b\";s:18:\"delete_penghapusan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:17;a:4:{s:1:\"a\";s:2:\"18\";s:1:\"b\";s:17:\"view_pemeliharaan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:18;a:4:{s:1:\"a\";s:2:\"19\";s:1:\"b\";s:19:\"create_pemeliharaan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:19;a:4:{s:1:\"a\";s:2:\"20\";s:1:\"b\";s:17:\"edit_pemeliharaan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:20;a:4:{s:1:\"a\";s:2:\"21\";s:1:\"b\";s:19:\"delete_pemeliharaan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:21;a:4:{s:1:\"a\";s:2:\"22\";s:1:\"b\";s:11:\"view_komisi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:22;a:4:{s:1:\"a\";s:2:\"23\";s:1:\"b\";s:13:\"create_komisi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:23;a:4:{s:1:\"a\";s:2:\"24\";s:1:\"b\";s:11:\"edit_komisi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:24;a:4:{s:1:\"a\";s:2:\"25\";s:1:\"b\";s:13:\"delete_komisi\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:25;a:4:{s:1:\"a\";s:2:\"26\";s:1:\"b\";s:13:\"view_pengguna\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:26;a:4:{s:1:\"a\";s:2:\"27\";s:1:\"b\";s:15:\"create_pengguna\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:27;a:4:{s:1:\"a\";s:2:\"28\";s:1:\"b\";s:13:\"edit_pengguna\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:28;a:4:{s:1:\"a\";s:2:\"29\";s:1:\"b\";s:15:\"delete_pengguna\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:29;a:4:{s:1:\"a\";s:2:\"30\";s:1:\"b\";s:11:\"view_backup\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:30;a:4:{s:1:\"a\";s:2:\"31\";s:1:\"b\";s:13:\"create_backup\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:31;a:4:{s:1:\"a\";s:2:\"32\";s:1:\"b\";s:14:\"restore_backup\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:32;a:4:{s:1:\"a\";s:2:\"33\";s:1:\"b\";s:17:\"print-asset-cards\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}}s:5:\"roles\";a:3:{i:0;a:3:{s:1:\"a\";s:1:\"1\";s:1:\"b\";s:10:\"Superadmin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";s:1:\"2\";s:1:\"b\";s:5:\"Admin\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";s:1:\"3\";s:1:\"b\";s:6:\"Komisi\";s:1:\"c\";s:3:\"web\";}}}', 1771148421);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dummy_barangs`
--

CREATE TABLE `dummy_barangs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `komisi`
--

CREATE TABLE `komisi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_komisi` varchar(255) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `komisi`
--

INSERT INTO `komisi` (`id`, `nama_komisi`, `keterangan`, `created_at`, `updated_at`) VALUES
(9, 'KPPL', NULL, '2025-11-09 00:47:32', '2025-11-09 00:47:32'),
(11, 'Diakonia', NULL, '2025-11-09 00:47:58', '2025-11-09 00:47:58'),
(12, 'KPT', NULL, '2025-11-09 02:36:02', '2025-11-09 02:36:02'),
(21, 'Komperlitbang', NULL, '2025-11-11 20:04:30', '2025-11-11 20:04:30'),
(22, 'BP Tanggul Bencana', NULL, '2025-11-11 20:05:03', '2025-11-11 20:05:03'),
(23, 'KPK', NULL, '2025-11-11 21:07:31', '2025-11-11 21:07:31'),
(25, 'KPAR', NULL, '2025-11-15 05:11:03', '2025-11-15 05:11:03'),
(26, 'KPPW', NULL, '2025-11-15 05:11:08', '2025-11-15 05:11:08'),
(27, 'KAUM', NULL, '2025-11-15 05:11:20', '2025-11-15 05:11:20'),
(28, 'KMTI', NULL, '2025-11-15 05:11:29', '2025-11-15 05:11:29'),
(29, 'KP2J', NULL, '2025-11-15 05:13:41', '2025-11-15 05:13:41'),
(30, 'KPAY', NULL, '2025-11-15 05:13:59', '2025-11-15 05:13:59'),
(31, 'KPPCK', NULL, '2025-11-15 05:14:07', '2025-11-15 05:14:07'),
(32, 'KPPM', NULL, '2025-11-15 05:14:20', '2025-11-15 05:14:20'),
(41, 'Sekretariat', NULL, '2025-12-13 06:35:14', '2025-12-13 06:35:14'),
(42, 'Komisi Administrasi', 'Mengurusi administrasi gereja', '2025-12-27 20:19:15', '2025-12-27 20:19:15'),
(43, 'Komisi Pelayanan', 'Mengurusi pelayanan ibadah', '2025-12-27 20:19:15', '2025-12-27 20:19:15'),
(44, 'Komisi Musik', 'Mengurusi pujian dan musik ibadah', '2025-12-27 20:19:15', '2025-12-27 20:19:15'),
(45, 'Komisi Keuangan', 'Mengurusi keuangan gereja', '2025-12-27 20:19:15', '2025-12-27 20:19:15'),
(46, 'Komisi Sosial', 'Mengurusi kegiatan sosial', '2025-12-27 20:19:15', '2025-12-27 20:19:15'),
(47, 'Komisi Pemuda', 'Mengurusi kegiatan pemuda', '2025-12-27 20:19:15', '2025-12-27 20:19:15'),
(48, 'Komisi Anak', 'Mengurusi kegiatan anak-anak', '2025-12-27 20:19:15', '2025-12-27 20:19:15'),
(49, 'Komisi Dapur Umum', 'Mengurusi dapur umum dan konsumsi', '2025-12-27 20:19:15', '2025-12-27 20:19:15');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_11_07_150149_create_permission_tables', 1),
(5, '2025_11_07_150228_create_komisi_table', 1),
(6, '2025_11_07_150245_create_barang_table', 1),
(7, '2025_11_07_150253_create_peminjaman_table', 1),
(8, '2025_11_07_150302_create_mutasi_table', 1),
(9, '2025_11_07_150311_create_penghapusan_table', 1),
(10, '2025_11_07_150325_create_pemeliharaan_table', 1),
(11, '2025_11_07_150335_create_aktivitas_table', 1),
(12, '2025_11_07_150748_add_foreign_keys_to_users_table', 1),
(13, '2025_11_07_231717_create_sessions_table', 1),
(14, '2025_11_07_234106_add_active_column_to_users_table', 1),
(15, '2025_11_08_022349_add_timestamps_to_aktivitas_table', 2),
(16, '2025_11_08_024336_add_stok_columns_to_barang_and_peminjaman', 2),
(17, '2025_11_08_074816_make_foreign_key_nullable_for_user_deletion', 3),
(18, '2025_12_13_140200_create_dummy_barangs_table', 4),
(19, '2025_12_29_063402_add_qr_code_column_to_peminjaman_table', 5),
(20, '2025_12_29_063418_add_qr_code_column_to_mutasi_table', 5),
(21, '2025_12_29_063439_add_qr_code_column_to_penghapusan_table', 5),
(22, '2026_01_08_075712_create_qr_scan_logs_table', 6),
(23, '2026_01_30_133346_add_print_asset_cards_permission', 7),
(24, '2026_02_14_025231_add_user_id_to_barang_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 5),
(3, 'App\\Models\\User', 8),
(3, 'App\\Models\\User', 9),
(3, 'App\\Models\\User', 10),
(3, 'App\\Models\\User', 11),
(3, 'App\\Models\\User', 12),
(3, 'App\\Models\\User', 13),
(3, 'App\\Models\\User', 14),
(3, 'App\\Models\\User', 15),
(3, 'App\\Models\\User', 16),
(3, 'App\\Models\\User', 17),
(3, 'App\\Models\\User', 18),
(3, 'App\\Models\\User', 19),
(3, 'App\\Models\\User', 20),
(3, 'App\\Models\\User', 21),
(3, 'App\\Models\\User', 22);

-- --------------------------------------------------------

--
-- Table structure for table `mutasi`
--

CREATE TABLE `mutasi` (
  `id_mutasi` bigint(20) UNSIGNED NOT NULL,
  `barang_id` bigint(20) UNSIGNED NOT NULL,
  `lokasi_asal` varchar(255) NOT NULL,
  `lokasi_tujuan` varchar(255) NOT NULL,
  `tanggal_mutasi` date NOT NULL,
  `keterangan` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mutasi`
--

INSERT INTO `mutasi` (`id_mutasi`, `barang_id`, `lokasi_asal`, `lokasi_tujuan`, `tanggal_mutasi`, `keterangan`, `user_id`, `created_at`, `updated_at`, `qr_code`) VALUES
(12, 232, 'KPAR( POSISI DI PAK MINTO)', 'Kppl', '2025-12-07', NULL, 18, '2025-12-06 20:04:35', '2025-12-06 20:04:35', NULL),
(13, 252, 'KPAR ( aula bawah)', 'KPPL', '2025-12-07', NULL, 18, '2025-12-06 20:11:13', '2025-12-06 20:11:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pemeliharaan`
--

CREATE TABLE `pemeliharaan` (
  `id_pemeliharaan` bigint(20) UNSIGNED NOT NULL,
  `barang_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `biaya` decimal(15,2) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman`
--

CREATE TABLE `peminjaman` (
  `id_peminjaman` bigint(20) UNSIGNED NOT NULL,
  `barang_id` bigint(20) UNSIGNED NOT NULL,
  `jumlah_dipinjam` int(11) NOT NULL DEFAULT 1,
  `peminjam` varchar(255) NOT NULL,
  `tanggal_pinjam` date NOT NULL,
  `tanggal_kembali` date DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `status` enum('Dipinjam','Dikembalikan') NOT NULL DEFAULT 'Dipinjam',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penghapusan`
--

CREATE TABLE `penghapusan` (
  `id_penghapusan` bigint(20) UNSIGNED NOT NULL,
  `barang_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal_penghapusan` date NOT NULL,
  `alasan` text NOT NULL,
  `keterangan` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'view_dashboard', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(2, 'view_barang', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(3, 'create_barang', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(4, 'edit_barang', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(5, 'delete_barang', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(6, 'view_peminjaman', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(7, 'create_peminjaman', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(8, 'edit_peminjaman', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(9, 'delete_peminjaman', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(10, 'view_mutasi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(11, 'create_mutasi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(12, 'edit_mutasi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(13, 'delete_mutasi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(14, 'view_penghapusan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(15, 'create_penghapusan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(16, 'edit_penghapusan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(17, 'delete_penghapusan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(18, 'view_pemeliharaan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(19, 'create_pemeliharaan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(20, 'edit_pemeliharaan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(21, 'delete_pemeliharaan', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(22, 'view_komisi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(23, 'create_komisi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(24, 'edit_komisi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(25, 'delete_komisi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(26, 'view_pengguna', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(27, 'create_pengguna', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(28, 'edit_pengguna', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(29, 'delete_pengguna', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(30, 'view_backup', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(31, 'create_backup', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(32, 'restore_backup', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(33, 'print-asset-cards', 'web', '2026-02-06 23:53:23', '2026-02-06 23:53:23');

-- --------------------------------------------------------

--
-- Table structure for table `qr_scan_logs`
--

CREATE TABLE `qr_scan_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `scan_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `qr_code_content` text NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `additional_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `scanned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'Superadmin', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(2, 'Admin', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25'),
(3, 'Komisi', 'web', '2025-11-07 19:17:25', '2025-11-07 19:17:25');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3),
(4, 1),
(4, 2),
(4, 3),
(5, 1),
(5, 2),
(6, 1),
(6, 2),
(6, 3),
(7, 1),
(7, 2),
(7, 3),
(8, 1),
(8, 2),
(8, 3),
(9, 1),
(9, 2),
(10, 1),
(10, 2),
(10, 3),
(11, 1),
(11, 2),
(11, 3),
(12, 1),
(12, 2),
(12, 3),
(13, 1),
(14, 1),
(14, 2),
(14, 3),
(15, 1),
(15, 2),
(15, 3),
(16, 1),
(16, 3),
(17, 1),
(18, 1),
(18, 2),
(18, 3),
(19, 1),
(19, 2),
(19, 3),
(20, 1),
(20, 2),
(20, 3),
(21, 1),
(22, 1),
(22, 2),
(22, 3),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(30, 2),
(31, 1),
(32, 1),
(33, 1),
(33, 2),
(33, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('NEDkS9mWAdNunq43ZWHTdy2sQXzaZ1rO0DBcrVug', NULL, '103.163.138.23', 'Python/3.11 aiohttp/3.9.2', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY1Z6RVFhRzRTTW92WmRlUE1Sa29vVWJUaTRhV0pCM3RiYzhrRjJkdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjY6Imh0dHBzOi8vc2lhc2V0Z2tqd3Byb2IuY29tIjtzOjU6InJvdXRlIjtzOjQ6ImhvbWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1770447558),
('oupGasSvdi6fux8ZG1gvKbEnmX5zdZCZBAwGB5Wy', NULL, '110.137.103.134', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiSkp6N3U1a1ZMUWJRSDd5NW5rbU1SbmVkWUx4UVg5MlFWdkljVzNXUyI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozNjoiaHR0cHM6Ly9zaWFzZXRna2p3cHJvYi5jb20vZGFzaGJvYXJkIjt9czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHBzOi8vc2lhc2V0Z2tqd3Byb2IuY29tL2xvZ2luIjtzOjU6InJvdXRlIjtzOjU6ImxvZ2luIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1770447598);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `komisi_id` bigint(20) UNSIGNED DEFAULT NULL,
  `foto_profil` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama_lengkap`, `username`, `komisi_id`, `foto_profil`, `password`, `active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin GKJW', 'superadmin', NULL, NULL, '$2y$12$K9LEKAQ6jiSw7wP7DdZotesjckEzLKQ5ua0dU.Q0lJk8ax/TgFJRS', 1, NULL, '2025-11-07 19:17:25', '2026-02-14 00:58:01'),
(2, 'Admin GKJW', 'admin', NULL, NULL, '$2y$12$fCdYuZaglfrzWnI3nY/pAelNEZId6exeSjtegoub1vyu6jWhOEetG', 1, 'LvjR7VJO7u4b7KTcMyjBFtloky5IfGVm6CKiUEoQmESwk69Lwkg0eOyOfFvT', '2025-11-07 19:17:26', '2026-02-14 00:58:02'),
(5, 'Komisi Admin', 'komisi', 9, NULL, '$2y$12$pesupbiLR0DDtKoexS86Red/a33RUJ5vGkmT2/N1MWlkHSyiezFii', 1, NULL, '2025-11-11 01:10:52', '2026-02-14 00:58:02'),
(8, 'Komperlitbang', 'komperlitbang', 21, NULL, '$2y$12$deddbDKGNBrElEdztJ/6uuCHJlN2CuKNscLjW3JgbLq6qs1UD7R.y', 1, NULL, '2025-12-03 01:04:58', '2025-12-03 01:04:58'),
(9, 'Diakonia', 'diakonia', 11, NULL, '$2y$12$Ow.ElJBYtzCYcxRWC6OSm.z3Enwv/RMpwmGiYKSbclwHdrWXy43b6', 1, '2uFBP3gFC36DZsSs3MPcEjqhvHOHqWulW6xZ7opVrVwSeSsV1ESLZNncXQi6', '2025-12-03 01:07:24', '2025-12-03 01:07:24'),
(10, 'KPPL', 'kppl', 9, NULL, '$2y$12$q/YncNkmTxgY0o1Myy0qzO1HJP22Yts.Yu28spbJ3JP6icKXisOPC', 1, 'z0ikgXVH41KPOUrHvviGNXVgvUi8vFbPJkIbNLzjMXJJdhw6Rvn22sOPYgGa', '2025-12-03 01:10:46', '2025-12-03 01:10:46'),
(11, 'KPPM', 'kppm', 32, NULL, '$2y$12$exD5LuSBbwUjNWb1XV/R7.8/NQERl5OjHADBniWR2blEmmho7K252', 1, NULL, '2025-12-03 01:15:08', '2025-12-03 01:15:08'),
(12, 'KPPCK', 'kppck', 31, NULL, '$2y$12$XldMjZ6Qzp7AZeOaXn/fNez2S5oocnvHKYvVPQgwkHleoQFVN2C9e', 1, 'NYGdPb4BCCbijyNwJGdp7tWJwZ4VKMJtQ4C7gvXU2NUPKhY9yBqN1WaYa0K3', '2025-12-03 01:15:41', '2025-12-03 01:15:41'),
(13, 'KPAY', 'kpay', 30, NULL, '$2y$12$RcKIYnMdVCM56FpC6Nq6hetnHdaok0PNB2Ya5WLG2Jza0E.9pPf9K', 1, 'jjCpSNmAX5qmIh7671pe1ImaHkkhgUWOhlF4ZXRwiRXWoqmDrOdDV250wimQ', '2025-12-03 01:16:17', '2025-12-03 01:16:17'),
(14, 'KP2J', 'kp2j', 29, NULL, '$2y$12$xoY.nZrWkxjgUWEEOOA1ne8aBfoGhTNBrlY8kGzAjXR1XM1k54sBe', 1, 'lQE67kfgxN2Q8M7hwoXQqA5Ko9IiCFsgpfLWhl7yYB4Gx2hDP8sZWmtuCYnW', '2025-12-03 01:16:55', '2025-12-03 01:16:55'),
(15, 'KMTI', 'kmti', 28, NULL, '$2y$12$FgdsXmsVI6dm.K/cnSFJX.SP274dTu2Fl/pvsj2K3z4V.d2S7ZU.q', 1, 'KyJcoSvJXekpmVulX36f0mUl5XgOWii6Law01bTMZyLQtC4OItzSyv2Hs2Yp', '2025-12-03 01:17:25', '2025-12-03 01:17:25'),
(16, 'KAUM', 'kaum', 27, NULL, '$2y$12$4AhcJZ5Y8o6iwy2dYeGUDebBxHv2JqLwIVJyVbcjb6J6tGmM1iNLC', 1, NULL, '2025-12-03 01:17:56', '2025-12-03 01:17:56'),
(17, 'KPPW', 'kppw', 26, NULL, '$2y$12$KxlPED7OWF5xhDvktNekuuWhxMcrPzWglFVvuENQLppBEIDMbNZEW', 1, 'tsG0mhXyZWZ1LX4593fNps2sXSgSXkVIAbujNQx4z7uuQbtlfndbZJyBwBRh', '2025-12-03 01:18:44', '2025-12-03 01:18:44'),
(18, 'KPAR', 'kpar', 25, NULL, '$2y$12$9gE.U.WQxyCDvAWi1.Ghb.w.NTeh/.8pqYH0MzIsolFm0fSWKynmu', 1, NULL, '2025-12-03 01:19:33', '2025-12-03 01:19:33'),
(19, 'KPK', 'kpk', 23, NULL, '$2y$12$EElZSBP.WazLp/uIred85u.i4pAeuLUbdSNT0YukHVJj6SRMyaQ8O', 1, NULL, '2025-12-03 01:19:56', '2025-12-03 01:19:56'),
(20, 'KPT', 'kpt', 12, NULL, '$2y$12$TRh/PQichFUxR28wrxmLfOCKDdRRF0V4v8EtkJJ4GT0QCUnQbaC5C', 1, NULL, '2025-12-03 01:20:47', '2025-12-03 01:20:47'),
(21, 'BP Tanggul Bencana', 'bptanggulbencana', 22, NULL, '$2y$12$gw.ie7KyvTjc60IMFVqU8usO3BPEeBj9q5U9I751IRTSmKFWQuj/e', 1, '7cJhBbuwluJevnDDLaYfhWHFq8sD1qbCV7dQv5lsZRAWCfYgKKSwjK7C30Lv', '2025-12-03 01:21:37', '2025-12-03 01:21:37'),
(22, 'Sekretariat', 'sekretariat', 41, NULL, '$2y$12$qwVH4VNCmIlA95APLnR0luQfEjw6ryk0MgowQa2RhVjQMgDxUwid2', 1, NULL, '2025-12-13 06:35:54', '2025-12-13 06:35:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aktivitas_user_id_foreign` (`user_id`);

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id_barang`),
  ADD UNIQUE KEY `barang_kode_barang_unique` (`kode_barang`),
  ADD KEY `barang_komisi_id_foreign` (`komisi_id`),
  ADD KEY `barang_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `dummy_barangs`
--
ALTER TABLE `dummy_barangs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `komisi`
--
ALTER TABLE `komisi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `mutasi`
--
ALTER TABLE `mutasi`
  ADD PRIMARY KEY (`id_mutasi`),
  ADD KEY `mutasi_barang_id_foreign` (`barang_id`),
  ADD KEY `mutasi_user_id_foreign` (`user_id`);

--
-- Indexes for table `pemeliharaan`
--
ALTER TABLE `pemeliharaan`
  ADD PRIMARY KEY (`id_pemeliharaan`),
  ADD KEY `pemeliharaan_barang_id_foreign` (`barang_id`),
  ADD KEY `pemeliharaan_user_id_foreign` (`user_id`);

--
-- Indexes for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD PRIMARY KEY (`id_peminjaman`),
  ADD KEY `peminjaman_barang_id_foreign` (`barang_id`),
  ADD KEY `peminjaman_created_by_foreign` (`created_by`);

--
-- Indexes for table `penghapusan`
--
ALTER TABLE `penghapusan`
  ADD PRIMARY KEY (`id_penghapusan`),
  ADD KEY `penghapusan_barang_id_foreign` (`barang_id`),
  ADD KEY `penghapusan_user_id_foreign` (`user_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `qr_scan_logs`
--
ALTER TABLE `qr_scan_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD KEY `users_komisi_id_foreign` (`komisi_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aktivitas`
--
ALTER TABLE `aktivitas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=407;

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id_barang` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=286;

--
-- AUTO_INCREMENT for table `dummy_barangs`
--
ALTER TABLE `dummy_barangs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `komisi`
--
ALTER TABLE `komisi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `mutasi`
--
ALTER TABLE `mutasi`
  MODIFY `id_mutasi` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `pemeliharaan`
--
ALTER TABLE `pemeliharaan`
  MODIFY `id_pemeliharaan` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `peminjaman`
--
ALTER TABLE `peminjaman`
  MODIFY `id_peminjaman` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `penghapusan`
--
ALTER TABLE `penghapusan`
  MODIFY `id_penghapusan` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `qr_scan_logs`
--
ALTER TABLE `qr_scan_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD CONSTRAINT `aktivitas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_komisi_id_foreign` FOREIGN KEY (`komisi_id`) REFERENCES `komisi` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `barang_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mutasi`
--
ALTER TABLE `mutasi`
  ADD CONSTRAINT `mutasi_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE,
  ADD CONSTRAINT `mutasi_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pemeliharaan`
--
ALTER TABLE `pemeliharaan`
  ADD CONSTRAINT `pemeliharaan_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE,
  ADD CONSTRAINT `pemeliharaan_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD CONSTRAINT `peminjaman_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE,
  ADD CONSTRAINT `peminjaman_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `penghapusan`
--
ALTER TABLE `penghapusan`
  ADD CONSTRAINT `penghapusan_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `barang` (`id_barang`) ON DELETE CASCADE,
  ADD CONSTRAINT `penghapusan_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_komisi_id_foreign` FOREIGN KEY (`komisi_id`) REFERENCES `komisi` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
