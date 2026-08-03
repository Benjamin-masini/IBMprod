-- SQLite local schema for the APK (Room-friendly)
-- Path: db/local_schema.sql
-- Description:
--  - Central local DB for all modules: ZEWE, SQNGO, DEFA, GALERIE, ndaku, bu
--  - Media are stored as files (filesystem or MediaStore); DB stores paths/URIs and metadata.
--  - sync_log table records local operations to allow safe backup/sync later without data loss.
--  - Use JSON strings for flexible per-module metadata (requires JSON1 extension for validation if desired).

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- schema versioning for migrations
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER NOT NULL PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now'))
);

-- Users (local accounts or mapping to remote auth later)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  password_hash TEXT,
  metadata TEXT, -- JSON string for extra fields
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Modules registry (ZEWE, SQNGO, DEFA, GALERIE, ndaku, bu)
CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Core items table used by modules (flexible via metadata)
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER NOT NULL,
  owner_id INTEGER,
  title TEXT,
  body TEXT,
  metadata TEXT, -- JSON string: module-specific fields
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT,
  deleted INTEGER DEFAULT 0,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_items_module ON items(module_id);
CREATE INDEX IF NOT EXISTS idx_items_owner ON items(owner_id);

-- Media metadata (store actual media files in filesystem / MediaStore)
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER,
  owner_id INTEGER,
  file_path TEXT NOT NULL, -- content:// URI or absolute path on device
  mime_type TEXT,
  thumbnail_path TEXT,
  metadata TEXT, -- JSON string for custom data
  size INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  deleted INTEGER DEFAULT 0,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_media_item ON media(item_id);
CREATE INDEX IF NOT EXISTS idx_media_owner ON media(owner_id);

-- Tags and many-to-many linking
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS item_tags (
  item_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (item_id, tag_id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- App-wide settings (key-value JSON)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Sync log: queue of local changes (useful for backups and future sync)
CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_id INTEGER,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  payload TEXT, -- JSON representation of row or change
  processed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sync_log_processed ON sync_log(processed);

-- Optional: view of non-deleted items
CREATE VIEW IF NOT EXISTS active_items AS
SELECT * FROM items WHERE deleted = 0;

-- Triggers to set updated_at timestamps on updates (safe conditional to avoid infinite loop)
CREATE TRIGGER IF NOT EXISTS trg_items_set_updated_at
AFTER UPDATE ON items
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE items SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_media_set_updated_at
AFTER UPDATE ON media
FOR EACH ROW
WHEN NEW.created_at = OLD.created_at
BEGIN
  UPDATE media SET created_at = datetime('now') WHERE id = NEW.id;
END;

COMMIT;

-- Notes for developers:
-- 1) Store heavy media (photos/videos) on device storage or MediaStore and save the content:// URI in media.file_path.
-- 2) Keep metadata as JSON strings to avoid rigid schema changes per module. Use the JSON1 extension for queries when available.
-- 3) Use the sync_log table to record every local INSERT/UPDATE/DELETE with a JSON payload so you can later push a consistent change set to a server or for backup.
-- 4) Implement periodic backups (export DB file or incremental export of sync_log) via WorkManager to cloud or user drive to avoid data loss on reinstall.
-- 5) For Android Room, create entities mirroring these tables, and ensure DAO writes also insert into sync_log (use @Transaction to keep consistency).
