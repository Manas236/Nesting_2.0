-- ============================================================
-- Nesting Tree — database schema
-- ------------------------------------------------------------
-- Run this once against your MySQL server to create the database
-- and the table that stores contact-form enquiries.
--
--   mysql -u root -p < db/schema.sql
--
-- The database name here must match DB_NAME in your .env file.
-- ============================================================

CREATE DATABASE IF NOT EXISTS nesting_tree
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nesting_tree;

CREATE TABLE IF NOT EXISTS leads (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120)  NOT NULL,
  phone       VARCHAR(40)   NOT NULL,
  email       VARCHAR(160),
  project     VARCHAR(60),
  message     TEXT,
  source_page VARCHAR(255),
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
