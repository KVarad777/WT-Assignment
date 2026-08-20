-- ==========================================================
-- Database Schema: electricity_bill_db
-- Project: Electricity Bill Calculator & Management System
-- Stack: JSP + Servlets + JDBC + MySQL + Tomcat 8.5
-- ==========================================================

CREATE DATABASE IF NOT EXISTS electricity_bill_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE electricity_bill_db;

-- ----------------------------------------------------------
-- 1. Table: bill_slabs (Configurable Progressive Tariff Slabs)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS bill_slabs;

CREATE TABLE bill_slabs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slab_order INT NOT NULL UNIQUE,
    slab_name VARCHAR(50) NOT NULL,
    min_units DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_units DECIMAL(10, 2) NULL, -- NULL indicates no upper bound (e.g. Above 250 units)
    rate DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 2. Table: customers
-- ----------------------------------------------------------
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    consumer_number VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_consumer_number (consumer_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 3. Table: bills
-- ----------------------------------------------------------
CREATE TABLE bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    billing_month VARCHAR(20) NOT NULL,
    previous_reading DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    current_reading DECIMAL(10, 2) NOT NULL,
    units_consumed DECIMAL(10, 2) NOT NULL,
    energy_charge DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bills_customer FOREIGN KEY (customer_id) 
        REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_billing_month (billing_month),
    INDEX idx_customer_id (customer_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- SEED DATA
-- ==========================================================

-- 1. Insert Standard Progressive Tariff Slabs
INSERT INTO bill_slabs (slab_order, slab_name, min_units, max_units, rate, description) VALUES
(1, 'First 50 units', 0.00, 50.00, 3.50, 'Base lifeline tier for basic consumption'),
(2, 'Next 100 units', 50.00, 150.00, 4.00, 'Moderate domestic tier (51 to 150 units)'),
(3, 'Next 100 units', 150.00, 250.00, 5.20, 'Higher domestic consumption (151 to 250 units)'),
(4, 'Above 250 units', 250.00, NULL, 6.50, 'High consumption surcharge tier (>250 units)');

-- 2. Insert Sample Customers
INSERT INTO customers (id, customer_name, consumer_number, email, phone, address) VALUES
(1, 'Priya Sharma', 'ELC-10021', 'priya.sharma@example.com', '+91 98201 44521', 'Flat 402, Green Meadows, Mumbai'),
(2, 'Rajesh Patel', 'ELC-10042', 'rajesh.patel@example.com', '+91 97234 88123', '12, Sunrise Bungalows, Ahmedabad'),
(3, 'Vikram Verma', 'ELC-10085', 'vikram.verma@example.com', '+91 98110 55432', 'Sector 14, Urban Enclave, Gurugram'),
(4, 'Ananya Iyer', 'ELC-10114', 'ananya.iyer@example.com', '+91 94441 22345', '77, Temple Road, Chennai'),
(5, 'Rohan Mehta', 'ELC-10190', 'rohan.mehta@example.com', '+91 98920 11987', 'B-10, Hill View Apts, Pune');

-- 3. Insert Sample Calculated Bills Demonstrating All Slabs
-- Priya Sharma: 45 units (Slab 1 only) -> 45 * 3.50 = 157.50
INSERT INTO bills (customer_id, billing_month, previous_reading, current_reading, units_consumed, energy_charge, total_amount, created_at) VALUES
(1, 'August 2026', 1200.00, 1245.00, 45.00, 157.50, 157.50, '2026-08-05 10:15:00');

-- Rajesh Patel: 120 units (Slab 1 + Slab 2) -> (50*3.50) + (70*4.00) = 175 + 280 = 455.00
INSERT INTO bills (customer_id, billing_month, previous_reading, current_reading, units_consumed, energy_charge, total_amount, created_at) VALUES
(2, 'August 2026', 3450.00, 3570.00, 120.00, 455.00, 455.00, '2026-08-08 11:30:00');

-- Vikram Verma: 200 units (Slab 1 + Slab 2 + Slab 3) -> (50*3.50) + (100*4.00) + (50*5.20) = 175 + 400 + 260 = 835.00
INSERT INTO bills (customer_id, billing_month, previous_reading, current_reading, units_consumed, energy_charge, total_amount, created_at) VALUES
(3, 'August 2026', 5800.00, 6000.00, 200.00, 835.00, 835.00, '2026-08-12 14:20:00');

-- Ananya Iyer: 300 units (All 4 Slabs) -> (50*3.50) + (100*4.00) + (100*5.20) + (50*6.50) = 175 + 400 + 520 + 325 = 1420.00
INSERT INTO bills (customer_id, billing_month, previous_reading, current_reading, units_consumed, energy_charge, total_amount, created_at) VALUES
(4, 'August 2026', 8200.00, 8500.00, 300.00, 1420.00, 1420.00, '2026-08-15 16:45:00');

-- Rohan Mehta: 450 units (Heavy usage) -> (50*3.50) + (100*4.00) + (100*5.20) + (200*6.50) = 175 + 400 + 520 + 1300 = 2395.00
INSERT INTO bills (customer_id, billing_month, previous_reading, current_reading, units_consumed, energy_charge, total_amount, created_at) VALUES
(5, 'August 2026', 10500.00, 10950.00, 450.00, 2395.00, 2395.00, '2026-08-18 09:10:00');
