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

-- ------------------------------------------------------------
-- content_edits — in-page text edits made through the site itself.
--
-- APPEND-ONLY. Nothing here is ever UPDATEd or DELETEd: every save is a
-- new row, so the table is the full history of a piece of copy.
--
--   current value for a key = the row with the highest id
--   revert                  = INSERT a new row carrying an older new_text
--
-- `edit_key` is a DOM path (tag:nth-of-type(n)>… from <body>), which is why
-- it needs 512 chars. MySQL caps a utf8mb4 index key at 767 bytes, so the
-- composite index takes a 191-character prefix of it — plenty to narrow a
-- lookup down to a handful of rows.
-- ------------------------------------------------------------
-- client_ip / user_agent are audit columns: who made this change. Editing
-- needs no login, so this is the only record of where an edit came from.
-- They are NEVER returned to the browser — every SELECT the API serves
-- names its columns explicitly and leaves these two out. VARCHAR(45) is
-- the longest an IPv6 address can print. Both are NULL when the address
-- cannot be trusted; a placeholder would be worse than an absence.
CREATE TABLE IF NOT EXISTS content_edits (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  page_path     VARCHAR(255)  NOT NULL,
  edit_key      VARCHAR(512)  NOT NULL,
  original_text TEXT          NOT NULL,
  new_text      TEXT          NOT NULL,
  client_ip     VARCHAR(45)   NULL,
  user_agent    VARCHAR(255)  NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_page (page_path),
  INDEX idx_page_key (page_path, edit_key(191))
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
