import Database from "better-sqlite3";

export function criarBanco(caminho = process.env.DB_PATH || "dados.db") {
  const db = new Database(caminho);
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS trilhas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      nivel TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS recursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trilha_id INTEGER NOT NULL REFERENCES trilhas(id),
      titulo TEXT NOT NULL,
      link TEXT NOT NULL,
      tipo TEXT NOT NULL,
      concluido INTEGER NOT NULL DEFAULT 0
    );
  `);
  return db;
}
