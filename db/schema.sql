-- ============================================================
-- Nesting Tree — database schema
-- ------------------------------------------------------------
-- Run this once against your MySQL server to create the database
-- and BOTH tables the app needs:
--
--   leads         — contact-form enquiries (POST /api/contact)
--   content_edits — in-page copy edits, read on EVERY page view
--
-- This file is the schema of record. DEPLOYMENT.md §4 used to carry a
-- hand-written DDL that created `leads` only; it now points here. Create
-- `leads` alone and every page load queries a table that does not exist.
--
--   mysql -u root -p < db/schema.sql
--
-- The database name here must match DB_NAME in your .env file.
-- ============================================================

CREATE DATABASE IF NOT EXISTS nesting_tree
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nesting_tree;

-- `source_page` is a hidden form field where the page sets one, and the
-- Referer header everywhere else — see src/pages/api/contact.ts. A real
-- Referer carries the full URL and query string, so 255 was short enough to
-- truncate one silently (or, in strict mode, reject the INSERT and lose the
-- enquiry). 500 matches what DEPLOYMENT.md §4 always specified.
--
-- `created_at` MUST keep DEFAULT CURRENT_TIMESTAMP: the INSERT names only the
-- six content columns and never supplies a date.
CREATE TABLE IF NOT EXISTS leads (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120)  NOT NULL,
  phone       VARCHAR(40)   NOT NULL,
  email       VARCHAR(160),
  project     VARCHAR(60),
  message     TEXT,
  source_page VARCHAR(500),
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
-- client_ip / user_agent are audit columns: who made this change. Writes are
-- behind a single SHARED passphrase, so the session says an editor was signed
-- in but never which person — these two are the only record of where an edit
-- came from. They are NEVER returned to the browser — every SELECT the API
-- serves names its columns explicitly and leaves these two out. VARCHAR(45) is
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

-- ============================================================
-- After running this, confirm BOTH tables exist:
--
--   USE nesting_tree; SHOW TABLES;   -- expect leads AND content_edits
--
-- IF `leads` WAS ALREADY CREATED by an earlier run or by the old
-- DEPLOYMENT.md §4 DDL, the CREATE above is a no-op and source_page is still
-- VARCHAR(255). Widen it in place — the table is empty or nearly so, and this
-- is not a lossy change:
--
--   ALTER TABLE leads MODIFY source_page VARCHAR(500);
--
-- The application user needs SELECT and INSERT on BOTH tables. Granting them
-- on `leads` alone leaves every page view failing on content_edits:
--
--   GRANT SELECT, INSERT ON nesting_tree.leads         TO 'nesting_app'@'localhost';
--   GRANT SELECT, INSERT ON nesting_tree.content_edits TO 'nesting_app'@'localhost';
--
-- SELECT and INSERT are all the app ever uses: content_edits is append-only
-- (a revert INSERTs a new row carrying the older text) and leads is
-- write-only from the app's side.
-- ============================================================
