-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 29, 2026 at 01:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hhvtt_timetrack_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `activity_name` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `activity_name`, `status`, `created_at`, `updated_at`) VALUES
(4, 'Chamber Assembly ', 'Active', '2026-08-27 11:14:46', '2026-08-27 11:14:46'),
(5, 'Front Door Assembly ', 'Active', '2026-08-27 11:14:57', '2026-08-27 11:14:57'),
(6, 'Hot Zone Assembly ', 'Active', '2026-08-27 11:15:05', '2026-08-27 11:15:05'),
(7, 'Hot Zone back door assembly Assembly ', 'Active', '2026-08-27 11:15:12', '2026-08-27 11:15:12'),
(8, 'Hot zone front door assembly', 'Active', '2026-08-27 11:15:21', '2026-08-27 11:15:21'),
(9, 'Bus bars assembly', 'Active', '2026-08-27 11:15:28', '2026-08-27 11:15:28'),
(10, 'Vacuum Pipeline assembly', 'Active', '2026-08-27 11:15:36', '2026-08-27 11:15:36'),
(11, 'Heat exchanger pipeline', 'Active', '2026-08-27 11:15:48', '2026-08-27 11:15:48'),
(12, 'Rigid Thermocouples assemby', 'Active', '2026-08-27 11:15:54', '2026-08-27 11:15:54'),
(13, 'Flexible Thermocouple  Assembly ', 'Active', '2026-08-27 11:16:45', '2026-08-27 11:16:45'),
(14, 'Lock ring Assembly ', 'Active', '2026-08-27 11:16:59', '2026-08-27 11:16:59'),
(15, 'Blower Assembly ', 'Active', '2026-08-27 11:17:05', '2026-08-27 11:17:05'),
(16, 'Loading Trolley Assembly ', 'Active', '2026-08-27 11:17:13', '2026-08-27 11:17:13'),
(17, 'Gas pipeline assembly', 'Active', '2026-08-27 11:17:20', '2026-08-27 11:17:20'),
(18, 'Waterpipeline assembly', 'Active', '2026-08-27 11:17:27', '2026-08-27 11:17:27'),
(19, 'Pnumatic pipeline assembly', 'Active', '2026-08-27 11:18:05', '2026-08-27 11:18:05'),
(20, 'Electrical & Accessories', 'Active', '2026-08-27 11:18:11', '2026-08-27 11:18:11');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `department_code` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `department_name`, `department_code`, `status`, `created_at`, `updated_at`) VALUES
(4, 'Assembly', 'ASSY', 'Active', '2026-08-21 09:41:33', '2026-08-21 09:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `department_activities`
--

CREATE TABLE `department_activities` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department_activities`
--

INSERT INTO `department_activities` (`id`, `department_id`, `activity_id`, `status`, `created_at`, `updated_at`) VALUES
(8, 4, 4, 'Active', '2026-08-27 11:33:26', '2026-08-27 11:33:26'),
(9, 4, 5, 'Active', '2026-08-28 04:55:26', '2026-08-28 04:55:26'),
(10, 4, 6, 'Active', '2026-08-28 04:55:54', '2026-08-28 04:55:54'),
(11, 4, 7, 'Active', '2026-08-28 04:56:46', '2026-08-28 04:56:46'),
(12, 4, 8, 'Active', '2026-08-28 04:57:20', '2026-08-28 04:57:20'),
(13, 4, 9, 'Active', '2026-08-28 04:58:09', '2026-08-28 04:58:09'),
(14, 4, 10, 'Active', '2026-08-28 04:58:21', '2026-08-28 04:58:21'),
(15, 4, 11, 'Active', '2026-08-28 04:58:40', '2026-08-28 04:58:40'),
(16, 4, 12, 'Active', '2026-08-28 04:58:49', '2026-08-28 04:58:49'),
(17, 4, 13, 'Active', '2026-08-28 04:58:58', '2026-08-28 04:58:58'),
(18, 4, 14, 'Active', '2026-08-28 04:59:07', '2026-08-28 04:59:07'),
(19, 4, 15, 'Active', '2026-08-28 04:59:19', '2026-08-28 04:59:19'),
(20, 4, 16, 'Active', '2026-08-28 04:59:27', '2026-08-28 04:59:27'),
(21, 4, 17, 'Active', '2026-08-28 04:59:34', '2026-08-28 04:59:34'),
(22, 4, 18, 'Active', '2026-08-28 04:59:43', '2026-08-28 04:59:43'),
(23, 4, 19, 'Active', '2026-08-28 04:59:50', '2026-08-28 04:59:50'),
(24, 4, 20, 'Active', '2026-08-28 05:00:05', '2026-08-28 05:00:05');

-- --------------------------------------------------------

--
-- Table structure for table `department_work_types`
--

CREATE TABLE `department_work_types` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `work_type_id` int(11) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department_work_types`
--

INSERT INTO `department_work_types` (`id`, `department_id`, `work_type_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 2, 'Active', '2026-08-28 16:30:09', '2026-08-28 23:07:38'),
(2, 4, 3, 'Active', '2026-08-28 23:04:32', '2026-08-28 23:04:32'),
(3, 4, 1, 'Active', '2026-08-28 23:07:47', '2026-08-28 23:07:47'),
(4, 4, 4, 'Active', '2026-08-28 23:07:53', '2026-08-28 23:07:53');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `department_id` int(11) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `employee_name`, `department_id`, `designation`, `status`, `created_at`, `updated_at`) VALUES
(6, '6191', 'NAGARAJU G L', 4, 'FITTER', 'Active', '2026-08-21 11:13:31', '2026-08-21 11:13:51'),
(7, '6207', 'MRUTHUNJAYA J', 4, 'ELECTRICIAN', 'Active', '2026-08-21 11:15:15', '2026-08-21 11:15:15'),
(8, '6152', 'HANUMANTHARAJU B C', 4, 'FITTER', 'Active', '2026-08-21 11:15:57', '2026-08-21 11:15:57'),
(9, '6104', 'CHANDRASHEKAR H S', 4, 'ELECTRICIAN', 'Active', '2026-08-21 11:16:30', '2026-08-21 11:21:01'),
(10, '6224', 'SHARANNAPA', 4, 'TURNING OPERATOR', 'Active', '2026-08-21 11:17:06', '2026-08-21 11:17:06'),
(11, '6155', 'LOKESH K V', 4, 'FITTER', 'Active', '2026-08-21 11:17:42', '2026-08-21 11:17:42'),
(12, '6366', 'LOHITH KUMAR K T', 4, 'ELECTRICIAN', 'Active', '2026-08-21 11:18:54', '2026-08-21 11:20:52'),
(13, '6384', 'SREENIVASA T', 4, 'FITTER', 'Active', '2026-08-21 11:19:26', '2026-08-21 11:19:26'),
(14, '6385', 'RAYAKATTRA NANDESHWARA', 4, 'FITTER', 'Active', '2026-08-21 11:20:01', '2026-08-21 11:20:01'),
(15, '6398', 'NIRAJ SINGH', 4, 'TIG WELDER', 'Active', '2026-08-21 11:20:29', '2026-08-21 11:20:29'),
(16, '6412', 'UMESHA', 4, 'FITTER', 'Active', '2026-08-21 11:21:34', '2026-08-21 11:21:34'),
(17, '6414', 'CHANDRA MONDI', 4, 'FITTER', 'Active', '2026-08-21 11:23:20', '2026-08-21 11:23:20'),
(18, '6255', 'SANTHOSH KUMAR MALLIK', 4, 'FITTER', 'Active', '2026-08-21 11:24:10', '2026-08-21 11:24:10'),
(19, 'HTT00132', 'SHRIDHARA M', 4, 'TECHNICAL ASSISTANT', 'Active', '2026-08-21 11:31:41', '2026-08-21 11:31:41'),
(20, '6421', 'BASAVARAJU R', 4, 'FITTER', 'Active', '2026-08-21 11:32:23', '2026-08-21 11:32:23'),
(21, 'HTT00130', 'NIKHIL', 4, 'Engineer', 'Active', '2026-08-21 11:32:24', '2026-08-21 11:32:24'),
(22, 'HTT00120', 'RATHIN KUMAR T M', 4, 'Engineer', 'Active', '2026-08-21 11:32:57', '2026-08-21 11:32:57'),
(23, '6435', 'DAYANANDA S G', 4, 'FITTER', 'Active', '2026-08-21 11:33:31', '2026-08-21 11:33:31'),
(24, 'HTT00113', 'RAKSHITH S SALIAN', 4, 'Engineer', 'Active', '2026-08-21 11:33:32', '2026-08-21 11:33:32'),
(25, 'HTT00045', 'Sanganna Choudri', 4, 'SHIFT SUPERVISOR', 'Active', '2026-08-21 11:34:03', '2026-08-21 11:34:03'),
(26, '6438', 'SANJUKUMAR D PUJAR', 4, 'FITTER', 'Active', '2026-08-21 11:34:09', '2026-08-21 11:34:09'),
(27, '6143', 'THIPPESWAMY N J', 4, 'HELPER', 'Active', '2026-08-21 11:34:30', '2026-08-21 11:34:30'),
(28, 'HTT00042', 'UPENDRA V APSANGI', 4, 'MANAGER', 'Active', '2026-08-21 11:34:31', '2026-08-21 11:34:31'),
(29, '6154', 'MUNIRAJU M R', 4, 'FITTER', 'Active', '2026-08-21 11:34:55', '2026-08-21 11:34:55'),
(30, 'HTT00034', 'ANBU SADARACH A', 4, 'SHIFT SUPERVISOR', 'Active', '2026-08-21 11:34:57', '2026-08-21 11:34:57'),
(31, '6156', 'MANJUNATH', 4, 'FITTER', 'Active', '2026-08-21 11:35:21', '2026-08-21 11:35:21'),
(32, 'HTT00027', 'G SIDDAPPA', 4, 'ASSISTANT MANAGER', 'Active', '2026-08-21 11:35:27', '2026-08-21 11:35:27'),
(33, '6423', 'SATHISH G', 4, 'FITTER', 'Active', '2026-08-21 11:35:43', '2026-08-21 11:35:43'),
(34, 'HTT00023', 'AMANULLA', 4, 'FITTER', 'Active', '2026-08-21 11:35:53', '2026-08-21 11:35:53'),
(35, '6443', 'DHANANJAYA N', 4, 'FITTER', 'Active', '2026-08-21 11:36:08', '2026-08-21 11:36:08'),
(36, 'HTT00020', 'MURALIDHAR S K', 4, 'SUPERVISOR', 'Active', '2026-08-21 11:36:15', '2026-08-21 11:36:15'),
(37, '6446', 'MANOJ UMESH JOGALEKAR', 4, 'FITTER', 'Active', '2026-08-21 11:36:33', '2026-08-21 11:36:33'),
(38, 'HTT00015', 'M R SHAKTHI PRATHAP', 4, 'ASSISTANT MANAGER', 'Active', '2026-08-21 11:36:46', '2026-08-21 11:36:46'),
(39, '6447', 'LAKSHMIKANTH CHANDRASHEKAR GOUDA', 4, 'FITTER', 'Active', '2026-08-21 11:36:58', '2026-08-21 11:36:58'),
(40, 'HTT00014', 'T S MURALI', 4, 'TECHNICIAN', 'Active', '2026-08-21 11:37:13', '2026-08-21 11:37:13'),
(41, '6455', 'RAGHAVENDRA BOMMAGOUDA', 4, 'FITTER', 'Active', '2026-08-21 11:37:24', '2026-08-21 11:37:24'),
(42, 'HTT00012', 'ASHOK F GANJIGATTI', 4, 'ASSISTANT MANAGER', 'Active', '2026-08-21 11:37:55', '2026-08-21 11:37:55'),
(43, '6456', 'GANESH HULIYAPPA GOUDA', 4, 'FITTER', 'Active', '2026-08-21 11:37:57', '2026-08-21 11:37:57'),
(44, '6458', 'PUTTARAJA NAIK V', 4, 'ELECTRICIAN', 'Active', '2026-08-21 11:38:19', '2026-08-21 11:42:20'),
(45, 'HTT00010', 'RAMESH K', 4, 'FITTER', 'Active', '2026-08-21 11:38:37', '2026-08-21 11:38:37'),
(46, '6462', 'BOGESH', 4, 'HELPER', 'Active', '2026-08-21 11:38:55', '2026-08-21 11:38:55'),
(47, 'HTT00007', 'G SREERAMULU NAIDU', 4, 'ASSISTANT MANAGER', 'Active', '2026-08-21 11:39:03', '2026-08-21 11:39:03'),
(48, '6459', 'THIPPESHA H', 4, 'ELECTRICIAN', 'Active', '2026-08-21 11:39:24', '2026-08-21 11:42:07'),
(49, '6419', 'MANOJ B.D', 4, 'ELECTRICIAN', 'Active', '2026-08-21 11:39:35', '2026-08-21 11:41:51'),
(50, '6176', 'YATHISH CS', 4, 'FITTER', 'Active', '2026-08-21 11:39:55', '2026-08-21 11:39:55'),
(51, '6139', 'DEVARAJ E', 4, 'ELECTRICIAN', 'Active', '2026-08-21 11:40:08', '2026-08-21 11:41:21');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `project_code` varchar(20) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `status` enum('Active','Completed') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `project_code`, `project_name`, `customer_name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(3, '18242', 'SPL-458', 'Okosu Industries LLP', '', 'Active', '2026-08-21 10:01:43', '2026-08-23 16:05:46'),
(4, '18243', 'SPL-459', 'Okosu Industries LLP', '', 'Active', '2026-08-21 10:02:28', '2026-08-21 10:02:28'),
(5, '18289', 'SPL-466', 'Parle Elizabeth Tools Pvt Ltd', '', 'Active', '2026-08-21 10:03:56', '2026-08-21 10:03:56'),
(6, '18292', 'SPL-468', 'HHV, Dabaspet', '', 'Active', '2026-08-21 10:04:18', '2026-08-21 10:04:18'),
(7, '18257', 'SPL-460', 'BEL, Bangalore', '', 'Active', '2026-08-21 10:04:50', '2026-08-21 10:04:50'),
(8, '18315', 'SPL-469', 'VSSC, Trivandrum', '', 'Active', '2026-08-21 10:05:15', '2026-08-21 10:05:15'),
(9, '18362', 'SPL-470', 'ASL, Hyderabad', '', 'Active', '2026-08-21 10:05:56', '2026-08-21 10:05:56'),
(10, '18427', 'SPL-475', 'CMET, Hyderabad', '', 'Active', '2026-08-21 10:06:21', '2026-08-21 10:06:21'),
(11, '18440', 'SPL-476', 'GH Induction', '', 'Active', '2026-08-21 10:06:43', '2026-08-21 10:06:43'),
(12, '18443', 'SPL-478', 'Bellatrix Aerospace', '', 'Active', '2026-08-21 10:07:06', '2026-08-21 10:07:06'),
(13, '18458', 'STD - 491-1,2,3 & STD 487/3/3', 'BARC, Mumbai', '', 'Active', '2026-08-21 10:16:36', '2026-08-21 10:16:36'),
(14, '18470', 'SPL-479', 'IIT, Kanpur', '', 'Active', '2026-08-21 10:17:01', '2026-08-21 10:17:01'),
(15, '18478', 'SPL-480', 'ARCI, Hyderabad', '', 'Active', '2026-08-21 10:17:29', '2026-08-21 10:17:29'),
(16, '18492', 'SPL-481', 'Southern Electronics', '', 'Active', '2026-08-21 10:17:56', '2026-08-21 10:17:56'),
(17, '18506', 'SPL-482', 'Valeo Vision Belgique SA', '', 'Active', '2026-08-21 10:18:19', '2026-08-21 10:18:19'),
(18, '18509', 'SPL-483', 'L & T, Coimbatore', '', 'Active', '2026-08-21 10:18:37', '2026-08-21 10:18:37'),
(19, '18530', 'SPL-486', 'GH Induction', '', 'Active', '2026-08-21 10:19:02', '2026-08-21 10:19:02'),
(20, '18531', 'SPL-485', 'MTAR, Technologies (1)', '', 'Active', '2026-08-21 10:19:25', '2026-08-21 10:19:25'),
(21, '18540', 'SPL-487', 'MTAR, Hyderabad (2)', '', 'Active', '2026-08-21 10:20:05', '2026-08-21 10:20:05'),
(27, '18540', 'SPL-488', 'MTAR, Hyderabad (4)', '', 'Active', '2026-08-21 10:41:36', '2026-08-21 10:41:36'),
(28, '18540', 'SPL-489', 'MTAR, Hyderabad (6)', '', 'Active', '2026-08-21 10:42:01', '2026-08-21 10:42:01'),
(29, '18540', 'SPL-490', 'MTAR, Hyderabad (8)', '', 'Active', '2026-08-21 10:42:21', '2026-08-21 10:42:21'),
(30, '18540', 'SPL-491', 'MTAR, Hyderabad (10)', '', 'Active', '2026-08-21 10:42:50', '2026-08-21 10:42:50'),
(31, '18561', 'SPL-492', 'MTAR, Hyderabad (12)', '', 'Active', '2026-08-21 10:43:12', '2026-08-21 10:43:12'),
(32, '18561', 'SPL-493', 'MTAR, Hyderabad (14)', '', 'Active', '2026-08-21 10:43:41', '2026-08-21 10:43:41'),
(33, '18561', 'SPL-494', 'MTAR, Hyderabad (16)', '', 'Active', '2026-08-21 10:44:07', '2026-08-21 10:44:07'),
(34, '18608', 'STD-490/3/4', 'BARC, Mumbai', '', 'Active', '2026-08-21 10:44:23', '2026-08-21 10:44:23'),
(35, '18642', 'SPL-500', 'GH Induction', '', 'Active', '2026-08-21 10:44:49', '2026-08-21 10:44:49'),
(36, '18652', 'SPL-499', 'Shell n Tube', '', 'Active', '2026-08-21 10:45:08', '2026-08-21 10:45:08'),
(37, '18653', 'SPL-498', 'GH Induction', '', 'Active', '2026-08-21 10:45:29', '2026-08-22 08:03:23');

-- --------------------------------------------------------

--
-- Table structure for table `sub_activities`
--

CREATE TABLE `sub_activities` (
  `id` int(11) NOT NULL,
  `department_activity_id` int(11) NOT NULL,
  `sub_activity_name` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_activities`
--

INSERT INTO `sub_activities` (`id`, `department_activity_id`, `sub_activity_name`, `status`, `created_at`, `updated_at`) VALUES
(31, 8, 'Hydro Pressure Test', 'Active', '2026-08-28 04:16:18', '2026-08-28 04:49:20'),
(32, 8, 'Leak test', 'Active', '2026-08-28 05:53:25', '2026-08-28 05:53:25'),
(33, 8, 'Copper Coiling ', 'Active', '2026-08-28 05:54:17', '2026-08-28 05:54:17'),
(34, 9, 'Painting', 'Active', '2026-08-28 07:09:00', '2026-08-28 07:09:00'),
(35, 10, 'Cage assy , marking,opening sand blasting', 'Active', '2026-08-28 07:09:17', '2026-08-28 07:09:17'),
(36, 10, 'Heater clamps individual assembly', 'Active', '2026-08-28 07:09:30', '2026-08-28 07:09:30'),
(37, 10, 'Graphite Tubes inserting into the cage', 'Active', '2026-08-28 07:09:38', '2026-08-28 07:09:38'),
(38, 10, 'Holes opening for the Gas nozzles', 'Active', '2026-08-28 07:09:45', '2026-08-28 07:09:45'),
(39, 10, 'Holes opening for the Herth supports', 'Active', '2026-08-28 07:09:52', '2026-08-28 07:09:52'),
(40, 10, 'Heater clamps assembly', 'Active', '2026-08-28 07:10:00', '2026-08-28 07:10:00'),
(41, 10, 'Heater clamps assembly to the cage', 'Active', '2026-08-28 07:10:09', '2026-08-28 07:10:09'),
(42, 10, 'Gas nozzles baffles assembly and welding', 'Active', '2026-08-28 07:10:16', '2026-08-28 07:10:16'),
(43, 10, '3 Cages joining and assembly to the chamber', 'Active', '2026-08-28 07:10:23', '2026-08-28 07:10:23'),
(44, 10, 'Hotzone Back shielding plates welding to the chamber', 'Active', '2026-08-28 07:10:30', '2026-08-28 07:10:30'),
(45, 10, 'Electrodes holes opening in the cage', 'Active', '2026-08-28 07:10:37', '2026-08-28 07:10:37'),
(46, 10, 'Electrodes assembly', 'Active', '2026-08-28 07:10:44', '2026-08-28 07:10:44'),
(47, 10, 'Herth supports assembly (rods only)', 'Active', '2026-08-28 07:10:51', '2026-08-28 07:10:51'),
(48, 10, 'Heater assemby', 'Active', '2026-08-28 07:10:59', '2026-08-28 07:10:59'),
(49, 11, 'Graphite board assembly', 'Active', '2026-08-28 07:11:15', '2026-08-28 07:11:15'),
(50, 11, 'SS duct and cone welding', 'Active', '2026-08-28 07:11:22', '2026-08-28 07:11:22'),
(51, 11, 'Final assembly to the cage', 'Active', '2026-08-28 07:11:30', '2026-08-28 07:11:30'),
(52, 12, 'Graphite board assembly', 'Active', '2026-08-28 07:11:56', '2026-08-28 07:11:56'),
(53, 12, 'Cage assembly to the Door', 'Active', '2026-08-28 07:12:04', '2026-08-28 07:12:04'),
(54, 12, 'Cage holding studds welding', 'Active', '2026-08-28 07:12:12', '2026-08-28 07:12:12'),
(55, 13, 'Transformer', 'Active', '2026-08-28 07:12:20', '2026-08-28 07:12:20'),
(56, 13, 'Copper flats cutting', 'Active', '2026-08-28 07:12:30', '2026-08-28 07:12:30'),
(57, 13, 'Marking and bending', 'Active', '2026-08-28 07:12:40', '2026-08-28 07:12:40'),
(58, 13, 'Fixing holes drilling', 'Active', '2026-08-28 07:12:47', '2026-08-28 07:12:47'),
(59, 13, 'Sleeves assembly & final assembly', 'Active', '2026-08-28 07:12:56', '2026-08-28 07:12:56'),
(60, 14, 'Rotary and roots pump assembly', 'Active', '2026-08-28 07:13:02', '2026-08-28 07:13:02'),
(61, 14, 'L bend assembly', 'Active', '2026-08-28 07:13:12', '2026-08-28 07:13:12'),
(62, 14, 'L bend assembly Leak testing', 'Active', '2026-08-28 07:13:22', '2026-08-28 07:13:22'),
(63, 14, 'L bend assembly powder coating', 'Active', '2026-08-28 07:13:30', '2026-08-28 07:13:30'),
(64, 14, 'Final assembly to the system', 'Active', '2026-08-28 07:13:38', '2026-08-28 07:13:38'),
(65, 14, 'Pumping port baffle assembly', 'Active', '2026-08-28 07:13:46', '2026-08-28 07:13:46'),
(66, 14, 'RPV 1000 ', 'Active', '2026-08-28 07:13:54', '2026-08-28 07:13:54'),
(67, 14, 'RPV 1000 Body leak testing', 'Active', '2026-08-28 07:14:02', '2026-08-28 07:14:02'),
(68, 14, 'RPV 1000 Body Powder coating', 'Active', '2026-08-28 07:14:10', '2026-08-28 07:14:10'),
(69, 14, 'RPV 1000 Final assembly', 'Active', '2026-08-28 07:14:18', '2026-08-28 07:14:18'),
(70, 14, 'DP 1000 ASSEMBLY', 'Active', '2026-08-28 07:14:25', '2026-08-28 07:14:25'),
(71, 14, 'RPV 150', 'Active', '2026-08-28 07:14:34', '2026-08-28 07:14:34'),
(72, 14, 'Vacuum pipeline setting and welding', 'Active', '2026-08-28 07:14:43', '2026-08-28 07:14:43'),
(73, 14, 'Vac pipelines leak testing and powder coating', 'Active', '2026-08-28 07:14:53', '2026-08-28 07:14:53'),
(74, 14, 'Vac pipe line final assembly', 'Active', '2026-08-28 07:15:01', '2026-08-28 07:15:01'),
(75, 15, 'Heat exchanger leak testing', 'Active', '2026-08-28 07:15:15', '2026-08-28 07:15:15'),
(76, 15, 'Impellar chamber', 'Active', '2026-08-28 07:15:25', '2026-08-28 07:15:25'),
(77, 15, 'Bonet chamber', 'Active', '2026-08-28 07:15:33', '2026-08-28 07:15:33'),
(78, 15, 'HE Pipeline setting and welding', 'Active', '2026-08-28 07:15:51', '2026-08-28 07:15:51'),
(79, 15, 'HE Pipeline copper coiling', 'Active', '2026-08-28 07:16:00', '2026-08-28 07:16:00'),
(80, 15, 'HE pipeline powder coating', 'Active', '2026-08-28 07:16:09', '2026-08-28 07:16:09'),
(81, 15, 'GV 10 P Valves', 'Active', '2026-08-28 07:16:19', '2026-08-28 07:16:19'),
(82, 15, 'HE FINAL ASSEMBLY', 'Active', '2026-08-28 07:16:27', '2026-08-28 07:16:27'),
(83, 16, 'Ready to assembly', 'Active', '2026-08-28 07:16:46', '2026-08-28 07:16:46'),
(84, 17, 'Ready to assembly', 'Active', '2026-08-28 07:16:59', '2026-08-28 07:16:59'),
(85, 18, 'Limit switches assembly', 'Active', '2026-08-28 07:17:11', '2026-08-28 07:17:11'),
(86, 19, 'Blower housing ', 'Active', '2026-08-28 07:17:22', '2026-08-28 07:17:22'),
(87, 19, 'Blower housing pressure test', 'Active', '2026-08-28 07:17:36', '2026-08-28 07:17:36'),
(88, 19, 'Blower to be sent for winding', 'Active', '2026-08-28 07:17:46', '2026-08-28 07:17:46'),
(89, 19, 'Blower Ducts assembly & impellar assy', 'Active', '2026-08-28 07:17:55', '2026-08-28 07:17:55'),
(90, 19, 'Blower assembly', 'Active', '2026-08-28 07:18:05', '2026-08-28 07:18:05'),
(91, 20, 'Loading trolly assembly with inline to  chamber', 'Active', '2026-08-28 07:18:16', '2026-08-28 07:18:16'),
(92, 20, 'Cable drag chain assembly', 'Active', '2026-08-28 07:18:29', '2026-08-28 07:18:29'),
(93, 21, 'Gas valves assembly & pipeline welding', 'Active', '2026-08-28 07:18:42', '2026-08-28 07:18:42'),
(94, 22, 'Inlet and Out let Water manifolds ', 'Active', '2026-08-28 07:18:51', '2026-08-28 07:18:51'),
(95, 22, 'Manifolds powdwer coating', 'Active', '2026-08-28 07:19:00', '2026-08-28 07:19:00'),
(96, 22, 'WFS and Accessaries assembly', 'Active', '2026-08-28 07:19:08', '2026-08-28 07:19:08'),
(97, 22, 'Water lines rootingS', 'Active', '2026-08-28 07:19:18', '2026-08-28 07:19:18'),
(98, 23, 'FLR & Manifolds assemby', 'Active', '2026-08-28 07:19:31', '2026-08-28 07:19:31'),
(99, 23, 'Pnumatic line completion', 'Active', '2026-08-28 07:19:42', '2026-08-28 07:19:42'),
(100, 24, 'Control console poisitoning', 'Active', '2026-08-28 07:19:52', '2026-08-28 07:19:52'),
(101, 24, 'Cable trays assembly', 'Active', '2026-08-28 07:20:02', '2026-08-28 07:20:02'),
(102, 24, 'Out put wiring', 'Active', '2026-08-28 07:21:18', '2026-08-28 07:21:18');

-- --------------------------------------------------------

--
-- Table structure for table `work_logs`
--

CREATE TABLE `work_logs` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `activity_id` int(11) NOT NULL,
  `sub_activity_id` int(11) NOT NULL,
  `department_work_type_id` int(11) NOT NULL,
  `work_date` date DEFAULT curdate(),
  `duration_minutes` smallint(5) UNSIGNED NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_logs`
--

INSERT INTO `work_logs` (`id`, `employee_id`, `department_id`, `project_id`, `activity_id`, `sub_activity_id`, `department_work_type_id`, `work_date`, `duration_minutes`, `remarks`, `created_at`, `updated_at`) VALUES
(45, 47, 4, 3, 4, 31, 1, '2026-08-29', 60, '', '2026-08-29 07:06:32', '2026-08-29 07:06:32'),
(46, 47, 4, 3, 20, 100, 1, '2026-08-29', 60, '', '2026-08-29 07:10:41', '2026-08-29 07:10:41'),
(47, 51, 4, 7, 4, 31, 1, '2026-08-29', 270, '', '2026-08-29 07:14:56', '2026-08-29 07:14:56'),
(50, 51, 4, 3, 19, 98, 2, '2026-08-29', 30, '', '2026-08-29 07:17:32', '2026-08-29 07:17:32'),
(52, 51, 4, 3, 4, 33, 1, '2026-08-29', 260, '', '2026-08-29 08:04:18', '2026-08-29 08:04:18'),
(53, 47, 4, 3, 15, 86, 1, '2026-08-29', 60, '', '2026-08-29 08:44:21', '2026-08-29 08:44:21'),
(54, 47, 4, 3, 20, 100, 1, '2026-08-29', 90, '', '2026-08-29 08:49:54', '2026-08-29 08:49:54'),
(55, 51, 4, 3, 13, 84, 3, '2026-08-29', 60, '', '2026-08-29 08:50:50', '2026-08-29 08:50:50'),
(56, 47, 4, 33, 15, 87, 1, '2026-08-29', 135, '', '2026-08-29 08:53:29', '2026-08-29 08:53:29'),
(57, 11, 4, 29, 13, 84, 3, '2026-08-29', 30, '', '2026-08-29 08:54:09', '2026-08-29 08:54:09'),
(58, 51, 4, 8, 4, 31, 1, '2026-08-29', 210, '', '2026-08-29 09:12:05', '2026-08-29 09:12:05'),
(59, 42, 4, NULL, 9, 58, 1, '2026-08-29', 90, '', '2026-08-29 09:32:23', '2026-08-29 09:32:23'),
(60, 48, 4, 6, 6, 36, 1, '2026-08-29', 112, '', '2026-08-29 10:09:46', '2026-08-29 10:09:46');

-- --------------------------------------------------------

--
-- Table structure for table `work_types`
--

CREATE TABLE `work_types` (
  `id` int(11) NOT NULL,
  `work_type_name` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_types`
--

INSERT INTO `work_types` (`id`, `work_type_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Rework', 'Active', '2026-08-28 09:50:40', '2026-08-28 11:20:05'),
(2, 'Assembly', 'Active', '2026-08-28 14:39:12', '2026-08-29 08:11:27'),
(3, 'Break', 'Active', '2026-08-28 14:39:22', '2026-08-28 14:39:22'),
(4, 'Waiting', 'Active', '2026-08-28 14:39:41', '2026-08-28 14:39:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `activity_name` (`activity_name`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_name` (`department_name`),
  ADD UNIQUE KEY `department_code` (`department_code`);

--
-- Indexes for table `department_activities`
--
ALTER TABLE `department_activities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_id` (`department_id`,`activity_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `department_work_types`
--
ALTER TABLE `department_work_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_id` (`department_id`,`work_type_id`),
  ADD KEY `work_type_id` (`work_type_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_name` (`project_name`);

--
-- Indexes for table `sub_activities`
--
ALTER TABLE `sub_activities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_department_activity_sub_activity` (`department_activity_id`,`sub_activity_name`);

--
-- Indexes for table `work_logs`
--
ALTER TABLE `work_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `sub_activity_id` (`sub_activity_id`),
  ADD KEY `fk_work_logs_department_work_type` (`department_work_type_id`);

--
-- Indexes for table `work_types`
--
ALTER TABLE `work_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `work_type_name` (`work_type_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `department_activities`
--
ALTER TABLE `department_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `department_work_types`
--
ALTER TABLE `department_work_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `sub_activities`
--
ALTER TABLE `sub_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `work_logs`
--
ALTER TABLE `work_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `work_types`
--
ALTER TABLE `work_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `department_activities`
--
ALTER TABLE `department_activities`
  ADD CONSTRAINT `department_activities_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `department_activities_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`);

--
-- Constraints for table `department_work_types`
--
ALTER TABLE `department_work_types`
  ADD CONSTRAINT `department_work_types_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `department_work_types_ibfk_2` FOREIGN KEY (`work_type_id`) REFERENCES `work_types` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `sub_activities`
--
ALTER TABLE `sub_activities`
  ADD CONSTRAINT `fk_sub_activities_department_activity` FOREIGN KEY (`department_activity_id`) REFERENCES `department_activities` (`id`);

--
-- Constraints for table `work_logs`
--
ALTER TABLE `work_logs`
  ADD CONSTRAINT `fk_work_logs_department_work_type` FOREIGN KEY (`department_work_type_id`) REFERENCES `department_work_types` (`id`),
  ADD CONSTRAINT `work_logs_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `work_logs_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `work_logs_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `work_logs_ibfk_4` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  ADD CONSTRAINT `work_logs_ibfk_5` FOREIGN KEY (`sub_activity_id`) REFERENCES `sub_activities` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
