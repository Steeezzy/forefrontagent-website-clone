-- migrations/002_add_embeddings.sql
-- Add embeddings storage for RAG vectors (Turso / SQLite)
CREATE TABLE IF NOT EXISTS embeddings (
  id TEXT PRIMARY KEY,
  bot_id TEXT NOT NULL,
  chunk_id TEXT NOT NULL,
  text_excerpt TEXT,
  vector JSON,
  source_ref TEXT,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_embeddings_bot_id ON embeddings(bot_id);
