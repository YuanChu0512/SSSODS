const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { buildingLayout } = require('./config');

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

async function hasColumn(tableName, columnName) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  return columns.some((column) => column.name === columnName);
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS buildings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      building_code TEXT NOT NULL UNIQUE,
      building_name TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_code TEXT NOT NULL UNIQUE,
      room_name TEXT NOT NULL,
      building_id INTEGER,
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS seats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_code TEXT NOT NULL UNIQUE,
      seat_name TEXT NOT NULL,
      room_id INTEGER,
      area_id INTEGER,
      position_order INTEGER DEFAULT 0,
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
      reservation_date TEXT,
      start_minute INTEGER,
      end_minute INTEGER,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      cancelled_at TEXT,
      FOREIGN KEY (seat_id) REFERENCES seats(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS room_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reservation_date TEXT,
      start_minute INTEGER,
      end_minute INTEGER,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      cancelled_at TEXT,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
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

  const now = new Date().toISOString();

  if (!(await hasColumn('seats', 'room_id'))) {
    await run(`ALTER TABLE seats ADD COLUMN room_id INTEGER`);
  }

  if (!(await hasColumn('seats', 'position_order'))) {
    await run(`ALTER TABLE seats ADD COLUMN position_order INTEGER DEFAULT 0`);
  }

  if (!(await hasColumn('seats', 'area_id'))) {
    await run(`ALTER TABLE seats ADD COLUMN area_id INTEGER`);
  }

  if (!(await hasColumn('reservations', 'reservation_date'))) {
    await run(`ALTER TABLE reservations ADD COLUMN reservation_date TEXT`);
  }

  if (!(await hasColumn('reservations', 'start_minute'))) {
    await run(`ALTER TABLE reservations ADD COLUMN start_minute INTEGER`);
  }

  if (!(await hasColumn('reservations', 'end_minute'))) {
    await run(`ALTER TABLE reservations ADD COLUMN end_minute INTEGER`);
  }

  if (!(await hasColumn('users', 'role'))) {
    await run(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`);
  }

  if (!(await hasColumn('rooms', 'building_id'))) {
    await run(`ALTER TABLE rooms ADD COLUMN building_id INTEGER`);
  }

  await run(`UPDATE users SET role = 'user' WHERE role IN ('student', 'staff')`);

  const buildingCount = await get(`SELECT COUNT(*) AS count FROM buildings`);

  if (((buildingCount && buildingCount.count) || 0) === 0) {
    for (const building of buildingLayout) {
      await run(
        `INSERT OR IGNORE INTO buildings (building_code, building_name, created_at) VALUES (?, ?, ?)`,
        [building.buildingCode, building.buildingName, now]
      );
    }
  }

  const defaultBuilding = await get(
    `SELECT id, building_code AS buildingCode FROM buildings ORDER BY id ASC LIMIT 1`
  );

  if (defaultBuilding) {
    await run(
      `UPDATE rooms
       SET building_id = ?
       WHERE building_id IS NULL`,
      [defaultBuilding.id]
    );

    await run(
      `UPDATE seats
       SET area_id = (
         SELECT rooms.building_id
         FROM rooms
         WHERE rooms.id = seats.room_id
       )
       WHERE area_id IS NULL`
    );
  }

  const roomCount = await get(`SELECT COUNT(*) AS count FROM rooms`);
  const seatCount = await get(`SELECT COUNT(*) AS count FROM seats`);

  if (((roomCount && roomCount.count) || 0) === 0 && ((seatCount && seatCount.count) || 0) === 0) {
    for (const building of buildingLayout) {
      await run(
        `INSERT OR IGNORE INTO buildings (building_code, building_name, created_at) VALUES (?, ?, ?)`,
        [building.buildingCode, building.buildingName, now]
      );

      const buildingRecord = await get(`SELECT id FROM buildings WHERE building_code = ?`, [building.buildingCode]);

      for (const room of building.rooms) {
        await run(
          `INSERT OR IGNORE INTO rooms (room_code, room_name, building_id, created_at) VALUES (?, ?, ?, ?)`,
          [room.roomCode, room.roomName, buildingRecord.id, now]
        );
      }

      for (const seat of building.seats) {
        await run(
          `INSERT OR IGNORE INTO seats (seat_code, seat_name, area_id, room_id, position_order, created_at)
           VALUES (?, ?, ?, NULL, ?, ?)`,
          [seat.seatCode, seat.seatName, buildingRecord.id, seat.positionOrder, now]
        );

        const seatRecord = await get(`SELECT id FROM seats WHERE seat_code = ?`, [seat.seatCode]);

        await run(
          `INSERT OR IGNORE INTO seat_state (seat_id, occupancy_status, reservation_status, reserved_by_user_id, updated_at)
           VALUES (?, 'Free', 'Not Reserved', NULL, ?)`,
          [seatRecord.id, now]
        );
      }
    }
  }
}

module.exports = {
  run,
  get,
  all,
  initializeDatabase
};
