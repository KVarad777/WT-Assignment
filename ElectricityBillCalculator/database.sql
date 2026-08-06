-- ============================================================
--  Electricity Bill Calculator Database
--  File   : database.sql
--  Author : Senior Full Stack Java Developer
--  Date   : 2026
-- ============================================================

-- 1. Create & use the database
CREATE DATABASE IF NOT EXISTS electricity_bill_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE electricity_bill_db;

-- 2. Drop table if already exists (for clean re-runs)
DROP TABLE IF EXISTS bill_history;

-- 3. Create bill_history table
CREATE TABLE bill_history (
    id                 INT           AUTO_INCREMENT PRIMARY KEY,
    customer_name      VARCHAR(100)  NOT NULL,
    customer_number    VARCHAR(50)   NOT NULL,
    units              DOUBLE        NOT NULL,
    bill_amount        DOUBLE        NOT NULL,
    bill_month         VARCHAR(20)   DEFAULT NULL,
    paid               TINYINT(1)    NOT NULL DEFAULT 0,
    calculation_date   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_number (customer_number),
    INDEX idx_calculation_date (calculation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Insert sample data
INSERT INTO bill_history (customer_name, customer_number, units, bill_amount, calculation_date) VALUES
('Aarav Sharma',    'CUST-001', 45,  157.50, '2026-07-01 09:00:00'),
('Priya Mehta',     'CUST-002', 120, 397.50, '2026-07-03 10:15:00'),
('Rohan Gupta',     'CUST-003', 210, 767.00, '2026-07-05 11:30:00'),
('Sneha Patil',     'CUST-004', 320, 1272.50,'2026-07-07 14:00:00'),
('Vikram Singh',    'CUST-005', 75,  272.50, '2026-07-10 16:45:00'),
('Anita Rao',       'CUST-006', 0,   0.00,   '2026-07-12 08:30:00'),
('Kiran Joshi',     'CUST-007', 155, 592.00, '2026-07-15 12:00:00'),
('Deepa Nair',      'CUST-008', 250, 917.50, '2026-07-18 09:45:00'),
('Arjun Verma',     'CUST-009', 400, 2207.50,'2026-07-20 17:15:00'),
('Meera Krishnan',  'CUST-010', 90,  322.50, '2026-07-22 13:30:00');

-- 5. Verify
SELECT * FROM bill_history ORDER BY calculation_date DESC;

-- ============================================================
--  Slab Rate Reference:
--  First 50 units      : Rs. 3.50 / unit
--  Next 100 units      : Rs. 4.00 / unit  (51-150)
--  Next 100 units      : Rs. 5.20 / unit  (151-250)
--  Above 250 units     : Rs. 6.50 / unit
-- ============================================================
