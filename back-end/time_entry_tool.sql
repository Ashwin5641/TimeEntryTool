-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 11, 2026 at 01:41 PM
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
-- Database: `time_entry_tool`
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
(2, 4, 3, 'Inactive', '2026-08-28 23:04:32', '2026-09-11 04:54:31'),
(3, 4, 1, 'Active', '2026-08-28 23:07:47', '2026-08-28 23:07:47'),
(4, 4, 4, 'Active', '2026-08-28 23:07:53', '2026-08-28 23:07:53'),
(5, 4, 5, 'Active', '2026-09-11 05:15:20', '2026-09-11 05:15:20'),
(6, 4, 6, 'Active', '2026-09-11 06:05:05', '2026-09-11 06:05:05');

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
  `role` enum('Supervisor','Employee') DEFAULT 'Employee',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `employee_name`, `department_id`, `designation`, `role`, `status`, `created_at`, `updated_at`) VALUES
(6, '6191', 'NAGARAJU G L', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:13:31', '2026-08-21 11:13:51'),
(7, '6207', 'MRUTHUNJAYA J', 4, 'ELECTRICIAN', 'Employee', 'Active', '2026-08-21 11:15:15', '2026-08-21 11:15:15'),
(8, '6152', 'HANUMANTHARAJU B C', 4, 'FITTER', 'Supervisor', 'Active', '2026-08-21 11:15:57', '2026-09-08 09:54:14'),
(9, '6104', 'CHANDRASHEKAR H S', 4, 'ELECTRICIAN', 'Supervisor', 'Active', '2026-08-21 11:16:30', '2026-09-08 09:54:43'),
(10, '6224', 'SHARANNAPA', 4, 'TURNING OPERATOR', 'Employee', 'Active', '2026-08-21 11:17:06', '2026-08-21 11:17:06'),
(11, '6155', 'LOKESH K V', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:17:42', '2026-08-21 11:17:42'),
(12, '6366', 'LOHITH KUMAR K T', 4, 'ELECTRICIAN', 'Employee', 'Active', '2026-08-21 11:18:54', '2026-08-21 11:20:52'),
(13, '6384', 'SREENIVASA T', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:19:26', '2026-08-21 11:19:26'),
(14, '6385', 'RAYAKATTRA NANDESHWARA', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:20:01', '2026-08-21 11:20:01'),
(15, '6398', 'NIRAJ SINGH', 4, 'TIG WELDER', 'Employee', 'Active', '2026-08-21 11:20:29', '2026-08-21 11:20:29'),
(16, '6412', 'UMESHA', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:21:34', '2026-08-21 11:21:34'),
(17, '6414', 'CHANDRA MONDI', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:23:20', '2026-08-21 11:23:20'),
(18, '6255', 'SANTHOSH KUMAR MALLIK', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:24:10', '2026-08-21 11:24:10'),
(19, 'HTT00132', 'SHRIDHARA M', 4, 'Engineer', 'Supervisor', 'Active', '2026-08-21 11:31:41', '2026-09-09 05:04:02'),
(20, '6421', 'BASAVARAJU R', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:32:23', '2026-08-21 11:32:23'),
(21, 'HTT00130', 'NIKHIL', 4, 'Engineer', 'Supervisor', 'Active', '2026-08-21 11:32:24', '2026-09-04 03:46:04'),
(22, 'HTT00120', 'RATHIN KUMAR T M', 4, 'Engineer', 'Employee', 'Active', '2026-08-21 11:32:57', '2026-08-21 11:32:57'),
(23, '6435', 'DAYANANDA S G', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:33:31', '2026-08-21 11:33:31'),
(24, 'HTT00113', 'RAKSHITH S SALIAN', 4, 'Engineer', 'Employee', 'Active', '2026-08-21 11:33:32', '2026-08-21 11:33:32'),
(25, 'HTT00045', 'Sanganna Choudri', 4, 'SHIFT SUPERVISOR', 'Employee', 'Active', '2026-08-21 11:34:03', '2026-08-21 11:34:03'),
(26, '6438', 'SANJUKUMAR D PUJAR', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:34:09', '2026-08-21 11:34:09'),
(27, '6143', 'THIPPESWAMY N J', 4, 'HELPER', 'Employee', 'Active', '2026-08-21 11:34:30', '2026-08-21 11:34:30'),
(28, 'HTT00042', 'UPENDRA V APSANGI', 4, 'MANAGER', 'Supervisor', 'Active', '2026-08-21 11:34:31', '2026-09-08 09:53:42'),
(29, '6154', 'MUNIRAJU M R', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:34:55', '2026-08-21 11:34:55'),
(30, 'HTT00034', 'ANBU SADARACH A', 4, 'SHIFT SUPERVISOR', 'Employee', 'Active', '2026-08-21 11:34:57', '2026-08-21 11:34:57'),
(31, '6156', 'MANJUNATH', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:35:21', '2026-08-21 11:35:21'),
(32, 'HTT00027', 'G SIDDAPPA', 4, 'ASSISTANT MANAGER', 'Supervisor', 'Active', '2026-08-21 11:35:27', '2026-09-08 09:53:18'),
(33, '6423', 'SATHISH G', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:35:43', '2026-08-21 11:35:43'),
(34, 'HTT00023', 'AMANULLA', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:35:53', '2026-08-21 11:35:53'),
(35, '6443', 'DHANANJAYA N', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:36:08', '2026-08-21 11:36:08'),
(36, 'HTT00020', 'MURALIDHAR S K', 4, 'SUPERVISOR', 'Supervisor', 'Active', '2026-08-21 11:36:15', '2026-09-08 09:55:11'),
(37, '6446', 'MANOJ UMESH JOGALEKAR', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:36:33', '2026-08-21 11:36:33'),
(38, 'HTT00015', 'M R SHAKTHI PRATHAP', 4, 'ASSISTANT MANAGER', 'Supervisor', 'Active', '2026-08-21 11:36:46', '2026-09-08 09:53:06'),
(39, '6447', 'LAKSHMIKANTH CHANDRASHEKAR GOUDA', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:36:58', '2026-08-21 11:36:58'),
(40, 'HTT00014', 'T S MURALI', 4, 'TECHNICIAN', 'Employee', 'Active', '2026-08-21 11:37:13', '2026-08-21 11:37:13'),
(41, '6455', 'RAGHAVENDRA BOMMAGOUDA', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:37:24', '2026-08-21 11:37:24'),
(42, 'HTT00012', 'ASHOK F GANJIGATTI', 4, 'ASSISTANT MANAGER', 'Supervisor', 'Active', '2026-08-21 11:37:55', '2026-09-08 09:53:31'),
(43, '6456', 'GANESH HULIYAPPA GOUDA', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:37:57', '2026-08-21 11:37:57'),
(44, '6458', 'PUTTARAJA NAIK V', 4, 'ELECTRICIAN', 'Employee', 'Active', '2026-08-21 11:38:19', '2026-08-21 11:42:20'),
(45, 'HTT00010', 'RAMESH K', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:38:37', '2026-08-21 11:38:37'),
(46, '6462', 'BOGESH', 4, 'HELPER', 'Employee', 'Active', '2026-08-21 11:38:55', '2026-08-21 11:38:55'),
(47, 'HTT00007', 'G SREERAMULU NAIDU', 4, 'ASSISTANT MANAGER', 'Supervisor', 'Active', '2026-08-21 11:39:03', '2026-09-08 10:12:47'),
(48, '6459', 'THIPPESHA H', 4, 'ELECTRICIAN', 'Employee', 'Active', '2026-08-21 11:39:24', '2026-08-21 11:42:07'),
(49, '6419', 'MANOJ B.D', 4, 'ELECTRICIAN', 'Employee', 'Active', '2026-08-21 11:39:35', '2026-08-21 11:41:51'),
(50, '6176', 'YATHISH CS', 4, 'FITTER', 'Employee', 'Active', '2026-08-21 11:39:55', '2026-08-21 11:39:55'),
(51, '6139', 'DEVARAJ E', 4, 'ELECTRICIAN', 'Employee', 'Active', '2026-08-21 11:40:08', '2026-09-08 10:22:30');

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
(102, 24, 'Out put wiring', 'Active', '2026-08-28 07:21:18', '2026-08-28 07:21:18'),
(103, 8, 'Other', 'Active', '2026-09-08 10:24:50', '2026-09-08 10:24:50'),
(104, 9, 'Other', 'Active', '2026-09-08 10:25:01', '2026-09-08 10:25:01'),
(105, 10, 'Other', 'Active', '2026-09-08 10:25:07', '2026-09-08 10:25:07'),
(106, 11, 'Other', 'Active', '2026-09-08 10:25:14', '2026-09-08 10:25:14'),
(107, 12, 'Other', 'Active', '2026-09-08 10:25:23', '2026-09-08 10:25:23'),
(108, 13, 'Other', 'Active', '2026-09-08 10:25:31', '2026-09-08 10:25:31'),
(109, 14, 'Other', 'Active', '2026-09-08 10:26:05', '2026-09-08 10:26:05'),
(110, 15, 'Other', 'Active', '2026-09-08 10:26:16', '2026-09-08 10:26:16'),
(111, 16, 'Other', 'Active', '2026-09-08 10:26:23', '2026-09-08 10:26:23'),
(112, 17, 'Other', 'Active', '2026-09-08 10:26:29', '2026-09-08 10:26:29'),
(113, 18, 'Other', 'Active', '2026-09-08 10:26:37', '2026-09-08 10:26:37'),
(114, 19, 'Other', 'Active', '2026-09-08 10:26:43', '2026-09-08 10:26:43'),
(115, 20, 'Other', 'Active', '2026-09-08 10:26:54', '2026-09-08 10:26:54'),
(116, 21, 'Other', 'Active', '2026-09-08 10:27:05', '2026-09-08 10:27:05'),
(117, 22, 'Other', 'Active', '2026-09-08 10:27:13', '2026-09-08 10:27:13'),
(118, 23, 'Other', 'Active', '2026-09-08 10:27:21', '2026-09-08 10:27:21'),
(119, 24, 'Other', 'Active', '2026-09-08 10:27:31', '2026-09-08 10:27:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','employee') DEFAULT 'employee',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin@tet.com', '$2b$10$DBPk8NlQwxkx4yuZDbwRs.Ux8idYtNKCKpI23gHmqqahn50N81lPe', 'admin', '2026-09-11 08:53:02', '2026-09-11 09:11:42');

-- --------------------------------------------------------

--
-- Table structure for table `work_logs`
--

CREATE TABLE `work_logs` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `entered_by_employee_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `activity_id` int(11) DEFAULT NULL,
  `sub_activity_id` int(11) DEFAULT NULL,
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

INSERT INTO `work_logs` (`id`, `employee_id`, `entered_by_employee_id`, `department_id`, `project_id`, `activity_id`, `sub_activity_id`, `department_work_type_id`, `work_date`, `duration_minutes`, `remarks`, `created_at`, `updated_at`) VALUES
(77, 47, 47, 4, 7, 4, 103, 1, '2026-09-08', 480, 'Chamber and doors cleaning after painting\nBoth side chamber 4nos  o rings assy\nDoor  c  clamps pins 6 nos  assy\nMeterial followup but  not ready all meterials shortage\nSPL 415 system Customer mom points meterial follow up', '2026-09-08 11:46:18', '2026-09-08 11:46:18'),
(78, 32, 32, 4, 21, 18, 94, 1, '2026-09-08', 240, NULL, '2026-09-08 11:50:25', '2026-09-08 11:50:25'),
(79, 32, 32, 4, 21, 17, 93, 1, '2026-09-08', 120, NULL, '2026-09-08 11:51:39', '2026-09-08 11:51:39'),
(80, 32, 32, 4, 21, 17, 116, 1, '2026-09-08', 120, '10\"pipe line assembly\nmateriel followup', '2026-09-08 11:55:58', '2026-09-08 11:55:58'),
(81, 31, 32, 4, 21, 18, 94, 1, '2026-09-08', 480, NULL, '2026-09-08 11:57:23', '2026-09-08 11:57:23'),
(82, 39, 32, 4, 21, 17, 93, 1, '2026-09-08', 480, NULL, '2026-09-08 11:59:57', '2026-09-08 11:59:57'),
(83, 38, 38, 4, 27, 4, 32, 1, '2026-09-08', 240, 'Helium leak testing before powder coating with QC Witness. including Annular space.', '2026-09-08 12:05:30', '2026-09-08 12:05:30'),
(84, 38, 38, 4, 14, 4, 103, 4, '2026-09-08', 240, 'follow up with Mr gururaj, \nNew Leybold Leak detector unpacked and checked for the functionality and operational testing of 2nos', '2026-09-08 12:10:41', '2026-09-08 12:10:41'),
(85, 35, 38, 4, 27, 4, 32, 1, '2026-09-08', 240, NULL, '2026-09-08 12:11:38', '2026-09-08 12:11:38'),
(86, 42, 42, 4, 3, 4, 103, 1, '2026-09-08', 240, 'manual operating testing', '2026-09-08 12:47:51', '2026-09-08 12:47:51'),
(87, 42, 42, 4, 3, 4, 32, 1, '2026-09-08', 240, NULL, '2026-09-08 12:48:24', '2026-09-08 12:48:24'),
(88, 43, 42, 4, 3, 4, 32, 1, '2026-09-08', 300, 'leak testing', '2026-09-08 12:50:11', '2026-09-08 12:50:11'),
(89, 8, 8, 4, 21, 6, 35, 1, '2026-09-08', 480, NULL, '2026-09-08 14:28:16', '2026-09-08 14:28:16'),
(90, 11, 8, 4, 21, 6, 35, 1, '2026-09-08', 480, NULL, '2026-09-08 14:28:38', '2026-09-08 14:28:38'),
(91, 33, 8, 4, 21, 6, 35, 1, '2026-09-08', 480, NULL, '2026-09-08 14:29:15', '2026-09-08 14:29:15'),
(92, 21, 21, 4, 21, 18, 96, 1, '2026-09-08', 360, NULL, '2026-09-08 15:10:11', '2026-09-08 15:10:11'),
(93, 21, 21, 4, 4, 10, 109, 1, '2026-09-08', 30, 'Bellow assembly.', '2026-09-08 15:43:38', '2026-09-08 15:43:38'),
(94, 21, 21, 4, 21, 18, 97, 1, '2026-09-08', 90, '1.water line rooting for heat exchanger pipeline\n2.DP side water manifold', '2026-09-08 15:46:19', '2026-09-08 15:46:19'),
(95, 27, 21, 4, 21, 18, 96, 1, '2026-09-08', 480, '1.Heat Exchanger side accessories fixing and water line routing \n2. DP side water manifold fixing and routing', '2026-09-08 15:49:03', '2026-09-08 15:49:03'),
(96, 50, 21, 4, 21, 6, 36, 1, '2026-09-08', 480, NULL, '2026-09-08 15:50:05', '2026-09-08 15:50:05'),
(97, 41, 21, 4, 21, 18, 96, 1, '2026-09-08', 480, NULL, '2026-09-08 15:51:06', '2026-09-08 15:51:06'),
(98, 43, 21, 4, 27, 4, 103, 1, '2026-09-08', 180, 'Masking The Chamber for Painting. And cleaning nearby area of the Chamber', '2026-09-08 15:53:01', '2026-09-08 15:53:01'),
(99, 12, 21, 4, 21, 20, 102, 1, '2026-09-08', 480, NULL, '2026-09-08 15:55:16', '2026-09-08 15:55:16'),
(100, 9, 9, 4, 21, 20, 119, 1, '2026-09-09', 240, 'Electrical Control Panel Testing', '2026-09-09 00:42:54', '2026-09-09 00:42:54'),
(101, 8, 8, 4, 21, 6, 38, 1, '2026-09-09', 240, 'SPL-487/2, Hot Zone Assy', '2026-09-09 07:49:52', '2026-09-09 07:49:52'),
(102, 8, 8, 4, 21, 6, 39, 1, '2026-09-09', 240, 'Hot Zone Assy', '2026-09-09 07:50:43', '2026-09-09 07:50:43'),
(103, 9, 9, 4, 27, 20, 119, 1, '2026-09-09', 240, 'SPL-488, MTAR, Console Wiring \nSPL-460, BEL, Console Wiring', '2026-09-09 07:53:43', '2026-09-09 07:53:43'),
(104, 49, 9, 4, 27, 20, 119, 1, '2026-09-09', 480, 'SPL-488, Console Wiring', '2026-09-09 07:55:03', '2026-09-09 07:55:03'),
(105, 10, 9, 4, 27, 20, 119, 1, '2026-09-09', 360, 'SPL-488, Console Panel Front Door Cutout', '2026-09-09 07:56:49', '2026-09-09 07:56:49'),
(106, 19, 19, 4, 27, 4, 31, 1, '2026-09-09', 240, 'SPL-488, Bend Assy Pr Test @4Bar and Leak Test', '2026-09-09 08:00:33', '2026-09-09 08:00:33'),
(107, 19, 19, 4, 27, 4, 31, 1, '2026-09-09', 240, 'RPV-1000 Pr Test @4 Bar and Ready For the leak test', '2026-09-09 08:01:51', '2026-09-09 08:01:51'),
(108, 11, 19, 4, 27, 6, 38, 1, '2026-09-09', 240, NULL, '2026-09-09 08:02:50', '2026-09-09 08:02:50'),
(109, 11, 19, 4, 21, 6, 39, 1, '2026-09-09', 240, NULL, '2026-09-09 08:03:37', '2026-09-09 08:03:37'),
(110, 39, 19, 4, 27, 4, 103, 1, '2026-09-09', 240, 'SPL-488, MTAR, Chamber Masking For Painting', '2026-09-09 08:54:06', '2026-09-09 08:54:06'),
(111, 39, 19, 4, 27, 4, 31, 1, '2026-09-09', 120, 'Assembled Bend Assy For Leak & Pressure Test', '2026-09-09 08:55:33', '2026-09-09 08:55:33'),
(112, 39, 19, 4, 27, 4, 31, 1, '2026-09-09', 120, 'Assemble of RPV-1000', '2026-09-09 08:56:41', '2026-09-09 08:56:41'),
(113, 37, 19, 4, 27, 4, 103, 1, '2026-09-09', 240, 'Masking & Ready for Chamber Painting', '2026-09-09 08:58:32', '2026-09-09 08:58:32'),
(114, 37, 19, 4, 21, 18, 97, 1, '2026-09-09', 240, 'Inlet & Outlet Waterlines Routing', '2026-09-09 08:59:35', '2026-09-09 08:59:35'),
(115, 45, 19, 4, 27, 6, 40, 1, '2026-09-09', 480, NULL, '2026-09-09 09:00:22', '2026-09-09 09:00:22'),
(116, 16, 19, 4, 27, 6, 41, 1, '2026-09-09', 480, NULL, '2026-09-09 09:01:05', '2026-09-09 09:01:05'),
(117, 31, 19, 4, 21, 18, 97, 1, '2026-09-09', 480, NULL, '2026-09-09 09:01:45', '2026-09-09 09:01:45'),
(118, 32, 32, 4, 21, 16, 91, 1, '2026-09-09', 60, NULL, '2026-09-09 11:39:13', '2026-09-09 11:39:13'),
(119, 32, 32, 4, 21, 18, 96, 1, '2026-09-09', 300, NULL, '2026-09-09 11:41:05', '2026-09-09 11:41:05'),
(120, 32, 32, 4, 21, 13, 112, 1, '2026-09-09', 120, NULL, '2026-09-09 11:42:52', '2026-09-09 11:42:52'),
(121, 42, 42, 4, 3, 4, 103, 1, '2026-09-09', 240, '8\"bellow leak testing and rewelded check', '2026-09-09 12:25:37', '2026-09-09 12:25:37'),
(122, 35, 42, 4, 3, 4, 32, 3, '2026-09-09', 240, 'bellow cutting and marching', '2026-09-09 12:29:03', '2026-09-09 12:29:03'),
(123, 42, 42, 4, 3, 4, 103, 1, '2026-09-09', 240, 'vacuum testing', '2026-09-09 12:31:08', '2026-09-09 12:31:08'),
(124, 38, 38, 4, 27, 4, 31, 1, '2026-09-09', 240, '\'L\' Bend pressure tested for 4bar pressure, before powder coating and witnessed by QC', '2026-09-09 12:35:25', '2026-09-09 12:35:25'),
(125, 38, 38, 4, 27, 4, 32, 1, '2026-09-09', 120, '\'L\' Bend helium leak tested in presence of QC', '2026-09-09 12:37:11', '2026-09-09 12:37:11'),
(126, 38, 38, 4, 27, 4, 32, 1, '2026-09-09', 120, 'RPV-1000 Made ready for helium leak testing before powder coating and Mr. Nikhil continued the same and completed the task, and QC Witnessed.', '2026-09-09 12:41:14', '2026-09-09 12:41:14'),
(127, 46, 38, 4, 27, 4, 31, 1, '2026-09-09', 480, '\'L\' BEND pressure test and RPV-1000 Pressure test and helium leak test', '2026-09-09 12:44:39', '2026-09-09 12:44:39'),
(128, 21, 21, 4, 27, 10, 62, 1, '2026-09-09', 180, 'Conducted the leak testing of bend assembly and found OK (QC checked).', '2026-09-09 14:11:41', '2026-09-09 14:11:41'),
(129, 21, 21, 4, 27, 10, 67, 1, '2026-09-09', 120, 'Conducted the leak testing of RPV-1000 and found OK (QC checked).', '2026-09-09 14:13:01', '2026-09-09 14:13:01'),
(130, 21, 21, 4, 27, 10, 63, 1, '2026-09-09', 60, 'Preparing Bend Assembly for powder coating (Masking).', '2026-09-09 16:03:38', '2026-09-09 16:03:38'),
(131, 21, 21, 4, 21, 18, 97, 1, '2026-09-09', 60, 'Water line routing for RPV-1000 and bend Assembly', '2026-09-09 16:05:19', '2026-09-09 16:05:19'),
(132, 21, 21, 4, 27, 10, 68, 1, '2026-09-09', 60, 'Preparing the RPV-1000 body for powder coating (Masking).', '2026-09-09 16:06:45', '2026-09-09 16:06:45'),
(133, 50, 21, 4, 27, 6, 105, 1, '2026-09-09', 480, 'graphite sheet (file) cutting and hole opening to it.', '2026-09-09 16:08:55', '2026-09-09 16:08:55'),
(134, 6, 21, 4, 21, 11, 110, 1, '2026-09-09', 300, 'Bello assembly and bello studs assembly.', '2026-09-09 16:10:48', '2026-09-09 16:10:48'),
(135, 6, 21, 4, 21, 6, 105, 1, '2026-09-09', 180, 'Graphite file cutting.', '2026-09-09 16:11:19', '2026-09-09 16:11:19'),
(136, 13, 21, 4, 27, 16, 92, 1, '2026-09-09', 300, NULL, '2026-09-09 16:12:00', '2026-09-09 16:12:00'),
(137, 13, 21, 4, 3, 19, 98, 1, '2026-09-09', 180, NULL, '2026-09-09 16:12:23', '2026-09-09 16:12:23'),
(138, 33, 21, 4, 27, 15, 114, 1, '2026-09-09', 300, 'Blower motor cover and FTC cover assy.', '2026-09-09 16:13:39', '2026-09-09 16:13:39'),
(139, 33, 21, 4, 27, 10, 63, 1, '2026-09-09', 180, NULL, '2026-09-09 16:14:01', '2026-09-09 16:14:01'),
(140, 41, 21, 4, 27, 10, 63, 1, '2026-09-09', 480, NULL, '2026-09-09 16:15:07', '2026-09-09 16:15:07'),
(141, 9, 9, 4, 21, 20, 102, 1, '2026-09-10', 120, 'IPC Panel Fixing and Wiring \nUPS Battery Fixing and Wiring', '2026-09-10 07:40:49', '2026-09-10 07:40:49'),
(142, 9, 9, 4, 27, 20, 102, 1, '2026-09-10', 360, NULL, '2026-09-10 07:42:19', '2026-09-10 07:42:19'),
(143, 49, 9, 4, 27, 20, 102, 1, '2026-09-10', 480, NULL, '2026-09-10 07:42:52', '2026-09-10 07:42:52'),
(144, 10, 9, 4, 21, 20, 101, 1, '2026-09-10', 480, NULL, '2026-09-10 07:43:27', '2026-09-10 07:43:27'),
(145, 19, 19, 4, 27, 4, 103, 1, '2026-09-10', 120, 'Dismantling Of Bend Assy, RPV-1000 Dummy Plates After Leak Test and Welded KF-16 Clamp ready for painting', '2026-09-10 07:47:05', '2026-09-10 07:47:05'),
(146, 19, 19, 4, 14, 4, 103, 1, '2026-09-10', 360, 'After Painting Assembling of Chamber O rings, Support Structure Wheels and other Material collected from the Store.', '2026-09-10 07:51:17', '2026-09-10 07:51:17'),
(147, 8, 8, 4, 27, 6, 35, 1, '2026-09-10', 480, NULL, '2026-09-10 07:53:17', '2026-09-10 07:53:17'),
(148, 11, 8, 4, 27, 6, 35, 1, '2026-09-10', 480, 'Cage Matchings and Bearings Assy', '2026-09-10 07:54:44', '2026-09-10 07:54:44'),
(149, 39, 19, 4, 27, 4, 103, 1, '2026-09-10', 120, 'Masking RPV-1000 for Painting', '2026-09-10 07:56:24', '2026-09-10 07:56:24'),
(150, 39, 19, 4, 21, 4, 103, 1, '2026-09-10', 240, 'Electrode Waterlines Legrees Fixing', '2026-09-10 08:00:26', '2026-09-10 08:00:26'),
(151, 39, 19, 4, 3, 10, 109, 1, '2026-09-10', 120, '10\" Bellow Welding and assembling', '2026-09-10 08:10:56', '2026-09-10 08:10:56'),
(152, 36, 36, 4, 21, 20, 119, 1, '2026-09-10', 240, 'Electrical panel Testing and material follow up\'s.', '2026-09-10 08:12:54', '2026-09-10 08:12:54'),
(153, 36, 36, 4, 27, 20, 119, 1, '2026-09-10', 240, 'Material Collection and follow up\'s', '2026-09-10 08:14:15', '2026-09-10 08:14:15'),
(154, 16, 19, 4, 21, 6, 40, 1, '2026-09-10', 480, 'Graphite Stud Assembly.', '2026-09-10 08:17:09', '2026-09-10 08:17:09'),
(155, 45, 19, 4, 21, 6, 36, 1, '2026-09-10', 480, 'Hot Zone Heater Clamps Assy.', '2026-09-10 08:18:37', '2026-09-10 08:18:37'),
(156, 31, 32, 4, 21, 11, 110, 1, '2026-09-10', 240, 'Fixing of H E pipeline Bellow Cover Assy', '2026-09-10 08:21:29', '2026-09-10 08:21:29'),
(157, 31, 32, 4, 21, 11, 82, 1, '2026-09-10', 240, 'Final assembly for H E and water lines', '2026-09-10 08:30:42', '2026-09-10 08:30:42'),
(158, 42, 42, 4, 10, 18, 94, 1, '2026-09-10', 360, NULL, '2026-09-10 10:39:08', '2026-09-10 10:39:08'),
(159, 42, 42, 4, 10, 14, 113, 1, '2026-09-10', 120, 'cycled fixing', '2026-09-10 10:42:15', '2026-09-10 10:42:15'),
(160, 13, 42, 4, 10, 18, 94, 1, '2026-09-10', 240, 'water manifold fixing clamp making drilling', '2026-09-10 10:53:40', '2026-09-10 10:53:40'),
(161, 13, 42, 4, 10, 18, 117, 1, '2026-09-10', 240, NULL, '2026-09-10 10:54:19', '2026-09-10 10:54:19'),
(162, 32, 32, 4, 21, 10, 74, 1, '2026-09-10', 60, NULL, '2026-09-10 11:28:06', '2026-09-10 11:28:06'),
(163, 32, 32, 4, 27, 17, 93, 1, '2026-09-10', 120, NULL, '2026-09-10 11:29:16', '2026-09-10 11:29:16'),
(164, 32, 32, 4, 27, 18, 117, 1, '2026-09-10', 180, NULL, '2026-09-10 11:30:16', '2026-09-11 04:14:08'),
(165, 32, 32, 4, 27, 10, 60, 1, '2026-09-10', 120, NULL, '2026-09-10 11:32:04', '2026-09-10 11:32:04'),
(166, 38, 38, 4, 14, 4, 103, 1, '2026-09-10', 480, 'After powder coating,\n1/cleaning of masking tape of chamber, nozzle assly\n2.Castor wheels fixing for support structure.\n3.level mount fixing for stand assembly.\n4. Rotary pump oil charged, fixing holes are mismatching in support structure, new channel fixing for pump fixing.\n5. door \' O\' ring fixed To be fixed to chamber.', '2026-09-10 11:47:22', '2026-09-10 11:47:22'),
(167, 46, 38, 4, 14, 4, 103, 1, '2026-09-10', 480, '1.cleaning and fixing of chamber to support structure\n2. nozzle fixing\n3. door and pump fixing', '2026-09-10 11:49:28', '2026-09-10 11:49:28'),
(168, 35, 38, 4, 14, 4, 103, 1, '2026-09-10', 480, '1.chamber cleaning and fixing to support structure\n2. Nozzle assembly fixing \n3 pump channel fixing\n4 Back door fixing', '2026-09-10 11:52:25', '2026-09-10 11:52:25'),
(169, 47, 47, 4, 7, 4, 103, 1, '2026-09-10', 480, 'Waiting for meterial \nTransformer fixing stand recieved from painting .\nGrindwell installation pending points myself and prameela madam discussed with customer.\nRetort top plate arranged and packed for rework to sending Nasik .\nSS pipe 1\" arranged for sending grindwell to changeing the mfc gas pipe line', '2026-09-10 12:13:20', '2026-09-10 12:13:20'),
(170, 44, 36, 4, 7, 20, 102, 1, '2026-09-10', 480, NULL, '2026-09-10 13:23:39', '2026-09-10 13:23:39'),
(171, 48, 36, 4, 27, 20, 102, 1, '2026-09-10', 480, NULL, '2026-09-10 13:24:07', '2026-09-10 13:24:07'),
(172, 17, 36, 4, 14, 20, 101, 1, '2026-09-10', 480, NULL, '2026-09-10 13:25:24', '2026-09-10 13:25:24'),
(173, 12, 36, 4, 10, 20, 102, 1, '2026-09-10', 480, NULL, '2026-09-10 13:25:46', '2026-09-10 13:25:46'),
(174, 7, 36, 4, 27, 20, 102, 1, '2026-09-10', 480, NULL, '2026-09-10 13:26:22', '2026-09-10 13:26:22'),
(175, 21, 21, 4, 28, 11, 77, 1, '2026-09-10', 240, 'Bonnet chamber cleaning and Pressure testing.', '2026-09-10 15:01:54', '2026-09-10 15:01:54'),
(176, 50, 21, 4, 27, 6, 105, 1, '2026-09-10', 480, 'graphite sheet cutting for heater clamps.', '2026-09-10 15:05:35', '2026-09-10 15:05:35'),
(177, 6, 21, 4, 27, 6, 35, 1, '2026-09-10', 180, NULL, '2026-09-10 15:06:36', '2026-09-10 15:06:36'),
(178, 6, 21, 4, 21, 15, 114, 1, '2026-09-10', 120, 'Blower motor terminal assembly.', '2026-09-10 15:07:23', '2026-09-10 15:07:23'),
(179, 6, 21, 4, 27, 6, 105, 1, '2026-09-10', 180, 'graphite sheet cutting for heater clamps.', '2026-09-10 15:08:04', '2026-09-10 15:08:04'),
(180, 33, 21, 4, 21, 20, 101, 1, '2026-09-10', 480, NULL, '2026-09-10 15:08:27', '2026-09-10 15:08:27'),
(181, 41, 21, 4, 27, 11, 77, 1, '2026-09-10', 240, 'Cleaning & pressure test for Bonnet Chamber and Masking.\nAnd Material Unloading.', '2026-09-10 15:09:53', '2026-09-10 15:09:53'),
(182, 43, 21, 4, 27, 10, 109, 1, '2026-09-10', 210, 'initial vacuum pipeline welding.', '2026-09-10 15:11:33', '2026-09-10 15:11:33'),
(183, 43, 21, 4, 27, 18, 94, 1, '2026-09-10', 270, 'cleaning and masking to water manifolds.', '2026-09-10 15:12:47', '2026-09-10 15:12:47'),
(184, 29, 21, 4, 21, 15, 114, 1, '2026-09-10', 360, 'Blower Motor stand Positioning and Drilling.', '2026-09-10 15:14:42', '2026-09-10 15:14:42'),
(185, 29, 21, 4, 27, 6, 35, 1, '2026-09-10', 120, 'Dismantling the 3 cages and sending it to Sandblasting.', '2026-09-10 15:15:49', '2026-09-10 15:15:49'),
(186, 27, 21, 4, 21, 15, 114, 1, '2026-09-10', 360, 'Blower Motor stand Positioning and Drilling.', '2026-09-10 15:16:22', '2026-09-10 15:16:22'),
(187, 27, 21, 4, 27, 6, 35, 1, '2026-09-10', 120, 'Material Unloading, Cleaning and cage dismantling for Sandblasting.', '2026-09-10 15:17:46', '2026-09-10 15:17:46'),
(188, 21, 21, 4, 27, 18, 95, 1, '2026-09-10', 120, NULL, '2026-09-10 15:42:41', '2026-09-10 15:42:41'),
(189, 21, 21, 4, 27, 6, 105, 1, '2026-09-10', 120, 'CFC Nuts assembly to M6 stud.', '2026-09-10 15:44:09', '2026-09-10 15:44:09'),
(194, 19, 19, 4, 27, 4, 103, 6, '2026-09-11', 240, 'SPL-488, MTAR-4th Chamber After Painting Cleaning the Surrounding area .', '2026-09-11 08:20:13', '2026-09-11 08:20:13'),
(195, 19, 19, 4, 27, 11, 110, 1, '2026-09-11', 120, 'Adapter Assy Pr test @ 4 Bar - 2 No\'s', '2026-09-11 08:39:38', '2026-09-11 08:39:38'),
(196, 19, 19, 4, 21, 4, 103, 1, '2026-09-11', 120, 'DP and RP Oiling', '2026-09-11 08:41:12', '2026-09-11 08:41:12'),
(197, 20, 19, 4, NULL, NULL, NULL, 5, '2026-09-11', 480, 'Leave', '2026-09-11 08:43:30', '2026-09-11 08:43:30'),
(198, 31, 19, 4, 21, 15, 89, 1, '2026-09-11', 480, NULL, '2026-09-11 08:44:29', '2026-09-11 08:44:29'),
(199, 11, 19, 4, 21, 15, 89, 1, '2026-09-11', 480, NULL, '2026-09-11 08:44:55', '2026-09-11 08:44:55'),
(200, 45, 19, 4, 27, 6, 40, 1, '2026-09-11', 480, NULL, '2026-09-11 08:47:23', '2026-09-11 08:47:23'),
(201, 10, 19, 4, 27, 20, 101, 1, '2026-09-11', 360, NULL, '2026-09-11 08:48:33', '2026-09-11 08:48:33'),
(202, 10, 19, 4, 21, 20, 119, 1, '2026-09-11', 120, 'Aeraulic Sheet For UPS Battery', '2026-09-11 08:50:25', '2026-09-11 08:50:25'),
(203, 8, 8, 4, 10, 6, 105, 1, '2026-09-11', 480, 'SS Shield assembling', '2026-09-11 08:52:20', '2026-09-11 08:52:20'),
(204, 16, 8, 4, 10, 6, 105, 1, '2026-09-11', 480, 'SS Shield assembly', '2026-09-11 08:53:02', '2026-09-11 08:53:02'),
(205, 37, 19, 4, NULL, NULL, NULL, 5, '2026-09-11', 480, 'Leave', '2026-09-11 08:55:48', '2026-09-11 08:55:48'),
(206, 21, 21, 4, 27, 18, 95, 1, '2026-09-11', 60, 'Inlet/Outlet Manifold pads welding and sent for Powder Coating.', '2026-09-11 09:51:23', '2026-09-11 09:51:23'),
(207, 21, 21, 4, 27, 4, 103, 1, '2026-09-11', 120, 'Chamber Positioning and layout Marking.', '2026-09-11 09:52:07', '2026-09-11 09:52:07'),
(208, 21, 21, 4, 21, 16, 115, 1, '2026-09-11', 60, 'Loading Trolly movement Checking.', '2026-09-11 09:53:38', '2026-09-11 09:53:38'),
(209, 49, 19, 4, 27, 20, 119, 1, '2026-09-11', 480, 'Console Wiring', '2026-09-11 10:16:48', '2026-09-11 10:16:48'),
(210, 21, 21, 4, 21, 15, 90, 1, '2026-09-11', 240, NULL, '2026-09-11 10:26:42', '2026-09-11 10:26:42'),
(211, 29, 21, 4, 21, 15, 90, 1, '2026-09-11', 480, NULL, '2026-09-11 10:27:17', '2026-09-11 10:27:17'),
(212, 6, 21, 4, 27, 10, 61, 1, '2026-09-11', 180, NULL, '2026-09-11 10:40:26', '2026-09-11 10:40:26'),
(213, 46, 21, 4, 27, 4, 103, 1, '2026-09-11', 120, 'Chamber Positioning and layout marking.', '2026-09-11 10:52:27', '2026-09-11 10:52:27'),
(214, 46, 21, 4, 27, 11, 110, 1, '2026-09-11', 120, 'Adapter (collar) pressure testing.', '2026-09-11 10:53:31', '2026-09-11 10:53:31'),
(215, 46, 21, 4, 27, 10, 61, 6, '2026-09-11', 120, NULL, '2026-09-11 10:53:53', '2026-09-11 10:53:53'),
(216, 46, 21, 4, 27, 10, 66, 6, '2026-09-11', 120, NULL, '2026-09-11 10:54:25', '2026-09-11 10:54:25'),
(217, 42, 42, 4, 10, 18, 94, 1, '2026-09-11', 240, 'water manifold clamp weeding fixing', '2026-09-11 11:27:34', '2026-09-11 11:27:34'),
(218, 42, 42, 4, 10, 19, 98, 1, '2026-09-11', 240, 'air manifold assembly work', '2026-09-11 11:30:24', '2026-09-11 11:30:24'),
(219, 39, 42, 4, 10, 19, 118, 1, '2026-09-11', 480, 'water nozzle fixe and air manifold assembly work', '2026-09-11 11:37:23', '2026-09-11 11:37:23');

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
(3, 'Break', 'Active', '2026-08-28 14:39:22', '2026-09-11 04:54:04'),
(4, 'Waiting', 'Active', '2026-08-28 14:39:41', '2026-08-28 14:39:41'),
(5, 'Leave / Permission', 'Active', '2026-09-11 05:15:06', '2026-09-11 05:15:06'),
(6, 'Cleaning / Masking', 'Active', '2026-09-11 06:04:52', '2026-09-11 06:04:52');

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `work_logs`
--
ALTER TABLE `work_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=220;

--
-- AUTO_INCREMENT for table `work_types`
--
ALTER TABLE `work_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
