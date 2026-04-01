const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'app.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS seats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_code TEXT NOT NULL UNIQUE,
      seat_name TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS seat_state (
      seat_id INTEGER PRIMARY KEY,
      occupancy_status TEXT NOT NULL,
      reservation_status TEXT NOT NULL,
      reserved_by_user_id INTEGER,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (seat_id) REFERENCES seats(id),
      FOREIGN KEY (reserved_by_user_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      cancelled_at TEXT,
      FOREIGN KEY (seat_id) REFERENCES seats(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS occupancy_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_id INTEGER NOT NULL,
      occupancy_status TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (seat_id) REFERENCES seats(id)
    )
  `);

  const primarySeatCode = 'seat-001';
  const now = new Date().toISOString();

  await run(
    `INSERT OR IGNORE INTO seats (seat_code, seat_name, created_at) VALUES (?, ?, ?)`,
    [primarySeatCode, 'Main Study Seat', now]
  );

  const seat = await get(`SELECT id FROM seats WHERE seat_code = ?`, [primarySeatCode]);

  await run(
    `INSERT OR IGNORE INTO seat_state (seat_id, occupancy_status, reservation_status, reserved_by_user_id, updated_at)
     VALUES (?, 'Free', 'Not Reserved', NULL, ?)`,
    [seat.id, now]
  );
}

module.exports = {
  run,
  get,
  all,
  initializeDatabase
};
