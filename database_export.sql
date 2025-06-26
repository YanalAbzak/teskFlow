-- ייצוא בסיס הנתונים - תוכנת המשימות האישית
-- תאריך יצירה: 2024

-- יצירת בסיס הנתונים
CREATE DATABASE IF NOT EXISTS `personal_tasks_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `personal_tasks_db`;

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `uname` varchar(50) NOT NULL UNIQUE,
  `passwd` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `type_id` int(11) DEFAULT 1,
  `tz` varchar(50) DEFAULT 'Asia/Jerusalem',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- טבלת קטגוריות
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#007bff',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- טבלת משימות
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `due_date` date DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- הכנסת משתמש ראשון (admin)
-- סיסמה: admin123 (מוצפנת ב-MD5 עם prefix "A")
INSERT INTO `users` (`name`, `uname`, `passwd`, `email`, `type_id`, `tz`) VALUES
('מנהל המערכת', 'admin', 'Aadmin123', 'admin@example.com', 1, 'Asia/Jerusalem');

-- הכנסת קטגוריות לדוגמה
INSERT INTO `categories` (`user_id`, `name`, `color`) VALUES
(1, 'עבודה', '#dc3545'),
(1, 'בית', '#28a745'),
(1, 'לימודים', '#007bff'),
(1, 'ספורט', '#ffc107'),
(1, 'קניות', '#6f42c1');

-- הכנסת משימות לדוגמה
INSERT INTO `tasks` (`user_id`, `category_id`, `description`, `due_date`, `is_completed`) VALUES
(1, 1, 'לסיים דוח חודשי', '2024-01-15', 0),
(1, 2, 'לנקות את הבית', '2024-01-10', 1),
(1, 3, 'לקרוא פרק 5 בספר', '2024-01-20', 0),
(1, 4, 'לרוץ 5 ק"מ', '2024-01-12', 0),
(1, 5, 'לקנות חלב ולחם', '2024-01-08', 1),
(1, 1, 'לשלוח מיילים ללקוחות', '2024-01-14', 0),
(1, 2, 'לתקן הברז במטבח', '2024-01-18', 0),
(1, 3, 'להכין מצגת לפרויקט', '2024-01-25', 0),
(1, 4, 'לעשות יוגה', '2024-01-11', 1),
(1, 5, 'לקנות מתנה ליום הולדת', '2024-01-30', 0);

-- יצירת אינדקסים לביצועים טובים יותר
CREATE INDEX `idx_tasks_user_completed` ON `tasks` (`user_id`, `is_completed`);
CREATE INDEX `idx_tasks_user_category` ON `tasks` (`user_id`, `category_id`);
CREATE INDEX `idx_tasks_due_date` ON `tasks` (`due_date`);
CREATE INDEX `idx_categories_user` ON `categories` (`user_id`);

-- הצגת נתונים לדוגמה
SELECT 'משתמשים:' as info;
SELECT id, name, uname, email, created_at FROM users;

SELECT 'קטגוריות:' as info;
SELECT c.id, c.name, c.color, u.name as user_name, c.created_at 
FROM categories c 
JOIN users u ON c.user_id = u.id;

SELECT 'משימות:' as info;
SELECT t.id, t.description, t.due_date, t.is_completed, 
       c.name as category_name, u.name as user_name, t.created_at
FROM tasks t 
JOIN users u ON t.user_id = u.id 
LEFT JOIN categories c ON t.category_id = c.id
ORDER BY t.created_at DESC; 