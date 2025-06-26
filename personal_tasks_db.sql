-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2025 at 12:29 AM
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
-- Database: `personal_tasks_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#007bff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`, `color`, `created_at`) VALUES
(1, 1, 'עבודה', '#dc3545', '2025-06-25 23:27:42'),
(2, 1, 'בית', '#28a745', '2025-06-25 23:27:42'),
(3, 1, 'לימודים', '#007bff', '2025-06-25 23:27:42'),
(4, 1, 'ספורט', '#ffc107', '2025-06-25 23:27:42'),
(5, 1, 'קניות', '#6f42c1', '2025-06-25 23:27:42'),
(6, 11, 'מטלה', '#007bff', '2025-06-25 23:50:56'),
(7, 15, 'לימודים', '#007bff', '2025-06-26 20:15:57'),
(8, 15, 'עבודה', '#f00000', '2025-06-26 20:17:32');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `due_date` date DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `category_id`, `description`, `due_date`, `is_completed`, `created_at`, `updated_at`, `sort_order`) VALUES
(1, 1, 1, 'לסיים דוח חודשי', '2024-01-15', 0, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(2, 1, 2, 'לנקות את הבית', '2024-01-10', 1, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(3, 1, 3, 'לקרוא פרק 5 בספר', '2024-01-20', 0, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(4, 1, 4, 'לרוץ 5 ק\"מ', '2024-01-12', 0, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(5, 1, 5, 'לקנות חלב ולחם', '2024-01-08', 1, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(6, 1, 1, 'לשלוח מיילים ללקוחות', '2024-01-14', 0, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(7, 1, 2, 'לתקן הברז במטבח', '2024-01-18', 0, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(8, 1, 3, 'להכין מצגת לפרויקט', '2024-01-25', 0, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(9, 1, 4, 'לעשות יוגה', '2024-01-11', 1, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(10, 1, 5, 'לקנות מתנה ליום הולדת', '2024-01-30', 0, '2025-06-25 23:27:42', '2025-06-25 23:27:42', 0),
(14, 15, 7, 'בדיקה', '2025-06-30', 0, '2025-06-26 20:16:51', '2025-06-26 22:22:16', 0),
(15, 15, 8, 'בדיקה', '2025-07-03', 0, '2025-06-26 20:17:51', '2025-06-26 22:04:33', 1),
(16, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:42', '2025-06-26 22:26:42', 0),
(17, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:45', '2025-06-26 22:26:45', 0),
(18, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:46', '2025-06-26 22:26:46', 0),
(19, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:46', '2025-06-26 22:26:46', 0),
(20, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:47', '2025-06-26 22:26:47', 0),
(21, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:47', '2025-06-26 22:26:47', 0),
(22, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:48', '2025-06-26 22:26:48', 0),
(23, 15, 7, '123', '2025-07-01', 0, '2025-06-26 22:26:48', '2025-06-26 22:26:48', 0),
(24, 15, 7, '123', '2025-06-27', 0, '2025-06-26 22:27:07', '2025-06-26 22:27:07', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `uname` varchar(50) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `type_id` int(11) DEFAULT 1,
  `tz` varchar(50) DEFAULT 'Asia/Jerusalem',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `uname`, `passwd`, `email`, `type_id`, `tz`, `created_at`) VALUES
(1, 'מנהל המערכת', 'admin', 'Aadmin123', 'admin@example.com', 1, 'Asia/Jerusalem', '2025-06-25 23:27:42'),
(11, 'yanal abzak', 'abzakcd', '6048a32c51ce9aa0e2d30cf74db3d59a', 'abzakcd@gmail.com', 1, 'Asia/Jerusalem', '2025-06-25 23:46:43'),
(15, 'ינאל', 'yanal', '6048a32c51ce9aa0e2d30cf74db3d59a', 'yanal@gmail.com', 1, 'Asia/Jerusalem', '2025-06-26 00:08:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_categories_user` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_tasks_user_completed` (`user_id`,`is_completed`),
  ADD KEY `idx_tasks_user_category` (`user_id`,`category_id`),
  ADD KEY `idx_tasks_due_date` (`due_date`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uname` (`uname`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
