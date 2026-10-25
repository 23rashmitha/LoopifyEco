-- ====================================================================
-- ReLoop Campus: Database Creation Script
-- Target: MySQL 8.0+
-- Character set: utf8mb4, Collation: utf8mb4_unicode_ci
-- ====================================================================

CREATE DATABASE IF NOT EXISTS reloop_campus
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE reloop_campus;

SELECT 'Database reloop_campus initialized successfully with utf8mb4.' AS status;
