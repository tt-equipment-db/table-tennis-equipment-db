CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id TEXT NOT NULL,
  text TEXT NOT NULL,
  ip_prefix TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_equipment_created
ON comments (equipment_id, created_at DESC);
