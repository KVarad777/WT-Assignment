-- ===================================================================
-- VIT SEMESTER RESULT MANAGEMENT SYSTEM — DATABASE SCHEMA & SEED DATA
-- Database: MySQL 8.0+
-- Database Name: vit_result_db
-- Host: localhost | Port: 3306
-- ===================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS `vit_result_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `vit_result_db`;

-- Disable Foreign Key checks for clean setup
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop existing tables if re-importing
DROP TABLE IF EXISTS `subject_marks`;
DROP TABLE IF EXISTS `semester_results`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `students`;

-- Enable Foreign Key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ===================================================================
-- TABLE 1: students
-- ===================================================================
CREATE TABLE `students` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `roll_number` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `program` VARCHAR(100) NOT NULL,
    `semester` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_student_roll` (`roll_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 2: subjects
-- ===================================================================
CREATE TABLE `subjects` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `subject_code` VARCHAR(20) NOT NULL UNIQUE,
    `subject_name` VARCHAR(150) NOT NULL,
    `credits` INT NOT NULL DEFAULT 4,
    INDEX `idx_subject_code` (`subject_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 3: semester_results
-- ===================================================================
CREATE TABLE `semester_results` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `student_id` BIGINT NOT NULL,
    `total_marks` DOUBLE NOT NULL,
    `average_percentage` DOUBLE NOT NULL,
    `sgpa` DOUBLE NOT NULL,
    `total_credits` INT NOT NULL,
    `result_status` VARCHAR(20) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_result_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
    INDEX `idx_result_student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- TABLE 4: subject_marks
-- ===================================================================
CREATE TABLE `subject_marks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `semester_result_id` BIGINT NOT NULL,
    `subject_id` BIGINT NOT NULL,
    `mse_marks` DOUBLE NOT NULL,
    `ese_marks` DOUBLE NOT NULL,
    `weighted_mse` DOUBLE NOT NULL,
    `weighted_ese` DOUBLE NOT NULL,
    `total_marks` DOUBLE NOT NULL,
    `grade` VARCHAR(10) NOT NULL,
    `grade_point` INT NOT NULL,
    `status` VARCHAR(10) NOT NULL,
    CONSTRAINT `fk_mark_result` FOREIGN KEY (`semester_result_id`) REFERENCES `semester_results` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_mark_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE RESTRICT,
    INDEX `idx_mark_result` (`semester_result_id`),
    INDEX `idx_mark_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================================
-- SEED DATA: Four Standard Curriculum Subjects
-- ===================================================================
INSERT INTO `subjects` (`id`, `subject_code`, `subject_name`, `credits`) VALUES
(1, 'CSE101', 'Data Structures', 4),
(2, 'CSE102', 'Database Management Systems', 4),
(3, 'CSE103', 'Computer Networks', 4),
(4, 'CSE104', 'Web Technology', 4);

-- ===================================================================
-- SEED DATA: Sample Students (Varad, Sarvesh, Niraj, Manas, Piyush)
-- ===================================================================
INSERT INTO `students` (`id`, `roll_number`, `name`, `program`, `semester`, `created_at`) VALUES
(1, '22BCE1001', 'Varad Deshpande', 'B.Tech Computer Science and Engineering', 5, NOW()),
(2, '22BCE1002', 'Sarvesh Joshi', 'B.Tech Computer Science and Engineering', 5, NOW()),
(3, '22BCE1003', 'Niraj Patil', 'B.Tech Computer Science and Engineering', 5, NOW()),
(4, '22BCE1004', 'Manas Kulkarni', 'B.Tech Computer Science and Engineering', 5, NOW()),
(5, '22BCE1005', 'Piyush Shinde', 'B.Tech Computer Science and Engineering', 5, NOW());

-- ===================================================================
-- SEED DATA: Semester Results & Subject Marks
-- ===================================================================

-- 1. Varad Deshpande (Distinction: Total = 369.9 / 400.0, SGPA = 9.75, PASS)
INSERT INTO `semester_results` (`id`, `student_id`, `total_marks`, `average_percentage`, `sgpa`, `total_credits`, `result_status`, `created_at`) VALUES
(1, 1, 369.9, 92.48, 9.75, 16, 'PASS', NOW());

INSERT INTO `subject_marks` (`semester_result_id`, `subject_id`, `mse_marks`, `ese_marks`, `weighted_mse`, `weighted_ese`, `total_marks`, `grade`, `grade_point`, `status`) VALUES
(1, 1, 92.0, 94.0, 27.6, 65.8, 93.4, 'O', 10, 'PASS'),
(1, 2, 88.0, 90.0, 26.4, 63.0, 89.4, 'A+', 9, 'PASS'),
(1, 3, 90.0, 92.0, 27.0, 64.4, 91.4, 'O', 10, 'PASS'),
(1, 4, 95.0, 96.0, 28.5, 67.2, 95.7, 'O', 10, 'PASS');

-- 2. Sarvesh Joshi (Grade A+: Total = 334.8 / 400.0, SGPA = 9.00, PASS)
INSERT INTO `semester_results` (`id`, `student_id`, `total_marks`, `average_percentage`, `sgpa`, `total_credits`, `result_status`, `created_at`) VALUES
(2, 2, 334.8, 83.70, 9.00, 16, 'PASS', NOW());

INSERT INTO `subject_marks` (`semester_result_id`, `subject_id`, `mse_marks`, `ese_marks`, `weighted_mse`, `weighted_ese`, `total_marks`, `grade`, `grade_point`, `status`) VALUES
(2, 1, 82.0, 85.0, 24.6, 59.5, 84.1, 'A+', 9, 'PASS'),
(2, 2, 80.0, 84.0, 24.0, 58.8, 82.8, 'A+', 9, 'PASS'),
(2, 3, 78.0, 82.0, 23.4, 57.4, 80.8, 'A+', 9, 'PASS'),
(2, 4, 85.0, 88.0, 25.5, 61.6, 87.1, 'A+', 9, 'PASS');

-- 3. Niraj Patil (Grade A: Total = 300.9 / 400.0, SGPA = 8.00, PASS)
INSERT INTO `semester_results` (`id`, `student_id`, `total_marks`, `average_percentage`, `sgpa`, `total_credits`, `result_status`, `created_at`) VALUES
(3, 3, 300.9, 75.23, 8.00, 16, 'PASS', NOW());

INSERT INTO `subject_marks` (`semester_result_id`, `subject_id`, `mse_marks`, `ese_marks`, `weighted_mse`, `weighted_ese`, `total_marks`, `grade`, `grade_point`, `status`) VALUES
(3, 1, 72.0, 76.0, 21.6, 53.2, 74.8, 'A', 8, 'PASS'),
(3, 2, 75.0, 78.0, 22.5, 54.6, 77.1, 'A', 8, 'PASS'),
(3, 3, 68.0, 72.0, 20.4, 50.4, 70.8, 'A', 8, 'PASS'),
(3, 4, 74.0, 80.0, 22.2, 56.0, 78.2, 'A', 8, 'PASS');

-- 4. Manas Kulkarni (Grade B+: Total = 244.8 / 400.0, SGPA = 6.75, PASS)
INSERT INTO `semester_results` (`id`, `student_id`, `total_marks`, `average_percentage`, `sgpa`, `total_credits`, `result_status`, `created_at`) VALUES
(4, 4, 244.8, 61.20, 6.75, 16, 'PASS', NOW());

INSERT INTO `subject_marks` (`semester_result_id`, `subject_id`, `mse_marks`, `ese_marks`, `weighted_mse`, `weighted_ese`, `total_marks`, `grade`, `grade_point`, `status`) VALUES
(4, 1, 60.0, 62.0, 18.0, 43.4, 61.4, 'B+', 7, 'PASS'),
(4, 2, 58.0, 64.0, 17.4, 44.8, 62.2, 'B+', 7, 'PASS'),
(4, 3, 52.0, 55.0, 15.6, 38.5, 54.1, 'B', 6, 'PASS'),
(4, 4, 65.0, 68.0, 19.5, 47.6, 67.1, 'B+', 7, 'PASS');

-- 5. Piyush Shinde (Fail in CSE104: Total = 173.3 / 400.0, SGPA = 4.00, FAIL)
INSERT INTO `semester_results` (`id`, `student_id`, `total_marks`, `average_percentage`, `sgpa`, `total_credits`, `result_status`, `created_at`) VALUES
(5, 5, 173.3, 43.33, 4.00, 16, 'FAIL', NOW());

INSERT INTO `subject_marks` (`semester_result_id`, `subject_id`, `mse_marks`, `ese_marks`, `weighted_mse`, `weighted_ese`, `total_marks`, `grade`, `grade_point`, `status`) VALUES
(5, 1, 50.0, 52.0, 15.0, 36.4, 51.4, 'B', 6, 'PASS'),
(5, 2, 48.0, 50.0, 14.4, 35.0, 49.4, 'C', 5, 'PASS'),
(5, 3, 42.0, 45.0, 12.6, 31.5, 44.1, 'C', 5, 'PASS'),
(5, 4, 20.0, 32.0, 6.0, 22.4, 28.4, 'F', 0, 'FAIL');
