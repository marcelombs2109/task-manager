const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// En Render, usar /data para persistencia. En local, usar la carpeta db/
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'tasks.db');

let db;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: file => path.join(__dirname, '../../node_modules/sql.js/dist/', file)
  });

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    )
  `);

  save();
  return db;
}

function save() {
  if (!db) return;
  const data = db.export();
  // Asegurar que el directorio existe antes de escribir
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getDb, save };
