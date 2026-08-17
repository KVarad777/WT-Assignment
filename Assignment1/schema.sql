CREATE DATABASE IF NOT EXISTS `powerpay_db`;
USE `powerpay_db`;

-- Table 1: Customers
CREATE TABLE IF NOT EXISTS `customers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `customer_name` VARCHAR(100) NOT NULL,
    `meter_number` VARCHAR(50) UNIQUE NOT NULL,
    `phone` VARCHAR(15),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 2: Bills (Linked via Foreign Key)
CREATE TABLE IF NOT EXISTS `bills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `customer_id` INT NOT NULL,
    `units_consumed` FLOAT NOT NULL,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `billing_month` VARCHAR(20) NOT NULL,
    `status` ENUM('UNPAID', 'PAID') DEFAULT 'UNPAID',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Pre-fill seed data for instant testing
INSERT INTO `customers` (`customer_name`, `meter_number`, `phone`) 
VALUES 
('Rahul Sharma', 'MTR-10024', '9876543210'),
('Priya Patel', 'MTR-10025', '9812345678');
