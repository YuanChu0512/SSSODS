const { all, get, run } = require('../db');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

async function createUniqueCode(tableName, columnName, prefix, sourceValue) {
  const base = slugify(sourceValue) || prefix;
  let index = 1;
  let code = `${prefix}-${base}`;
  while (await get(`SELECT id FROM ${tableName} WHERE ${columnName} = ?`, [code])) {
    index += 1;
    code = `${prefix}-${base}-${index}`;
  }
  return code;
}

async function listAdminLayout() {
  const areas = await all(
    `SELECT id AS areaId, building_code AS areaCode, building_name AS areaName
     FROM buildings
     ORDER BY building_name ASC`
  );
  const rooms = await all(
    `SELECT id AS roomId, room_code AS roomCode, room_name AS roomName, building_id AS areaDbId
     FROM rooms
     ORDER BY room_name ASC`
  );
  const seats = await all(
    `SELECT id AS seatId, seat_code AS seatCode, seat_name AS seatName, area_id AS areaDbId, position_order AS positionOrder
     FROM seats
     ORDER BY position_order ASC, seat_code ASC`
  );

  return areas.map((area) => ({
    areaId: area.areaId,
    areaCode: area.areaCode,
    areaName: area.areaName,
    rooms: rooms.filter((room) => room.areaDbId === area.areaId).map((room) => ({
      roomId: room.roomId,
      roomCode: room.roomCode,
      roomName: room.roomName
    })),
    seats: seats.filter((seat) => seat.areaDbId === area.areaId).map((seat) => ({
      seatId: seat.seatId,
      seatCode: seat.seatCode,
      seatName: seat.seatName,
      positionOrder: seat.positionOrder
    }))
  }));
}

async function createArea(areaName) {
  const trimmedName = String(areaName || '').trim();
  if (trimmedName.length < 2) {
    const error = new Error('Area name must be at least 2 characters.');
    error.statusCode = 400;
    throw error;
  }
  const areaCode = await createUniqueCode('buildings', 'building_code', 'area', trimmedName);
  const now = new Date().toISOString();
  const result = await run(
    `INSERT INTO buildings (building_code, building_name, created_at) VALUES (?, ?, ?)`,
    [areaCode, trimmedName, now]
  );
  return get(`SELECT id AS areaId, building_code AS areaCode, building_name AS areaName FROM buildings WHERE id = ?`, [result.lastID]);
}

async function updateArea(areaCode, areaName) {
  const trimmedName = String(areaName || '').trim();
  if (trimmedName.length < 2) {
    const error = new Error('Area name must be at least 2 characters.');
    error.statusCode = 400;
    throw error;
  }
  const area = await get(`SELECT id FROM buildings WHERE building_code = ?`, [areaCode]);
  if (!area) {
    const error = new Error('Area not found.');
    error.statusCode = 404;
    throw error;
  }
  await run(`UPDATE buildings SET building_name = ? WHERE building_code = ?`, [trimmedName, areaCode]);
  return get(`SELECT id AS areaId, building_code AS areaCode, building_name AS areaName FROM buildings WHERE building_code = ?`, [areaCode]);
}

async function deleteArea(areaCode) {
  const area = await get(`SELECT id FROM buildings WHERE building_code = ?`, [areaCode]);
  if (!area) {
    const error = new Error('Area not found.');
    error.statusCode = 404;
    throw error;
  }

  const roomIds = (await all(`SELECT id FROM rooms WHERE building_id = ?`, [area.id])).map((room) => room.id);
  if (roomIds.length) {
    const placeholders = roomIds.map(() => '?').join(', ');
    await run(`DELETE FROM room_reservations WHERE room_id IN (${placeholders})`, roomIds);
    await run(`DELETE FROM rooms WHERE id IN (${placeholders})`, roomIds);
  }

  const seatIds = (await all(`SELECT id FROM seats WHERE area_id = ?`, [area.id])).map((seat) => seat.id);
  if (seatIds.length) {
    const placeholders = seatIds.map(() => '?').join(', ');
    await run(`DELETE FROM occupancy_events WHERE seat_id IN (${placeholders})`, seatIds);
    await run(`DELETE FROM reservations WHERE seat_id IN (${placeholders})`, seatIds);
    await run(`DELETE FROM seat_state WHERE seat_id IN (${placeholders})`, seatIds);
    await run(`DELETE FROM seats WHERE id IN (${placeholders})`, seatIds);
  }

  await run(`DELETE FROM buildings WHERE id = ?`, [area.id]);
}

async function createRoom(roomName, areaCode) {
  const trimmedName = String(roomName || '').trim();
  if (trimmedName.length < 2) {
    const error = new Error('Room name must be at least 2 characters.');
    error.statusCode = 400;
    throw error;
  }
  const area = await get(`SELECT id FROM buildings WHERE building_code = ?`, [areaCode]);
  if (!area) {
    const error = new Error('Area not found.');
    error.statusCode = 404;
    throw error;
  }
  const roomCode = await createUniqueCode('rooms', 'room_code', 'room', trimmedName);
  const now = new Date().toISOString();
  const result = await run(
    `INSERT INTO rooms (room_code, room_name, building_id, created_at) VALUES (?, ?, ?, ?)`,
    [roomCode, trimmedName, area.id, now]
  );
  return get(
    `SELECT rooms.id AS roomId, rooms.room_code AS roomCode, rooms.room_name AS roomName,
            buildings.building_code AS areaCode, buildings.building_name AS areaName
     FROM rooms JOIN buildings ON buildings.id = rooms.building_id
     WHERE rooms.id = ?`,
    [result.lastID]
  );
}

async function updateRoom(roomCode, roomName, areaCode) {
  const trimmedName = String(roomName || '').trim();
  if (trimmedName.length < 2) {
    const error = new Error('Room name must be at least 2 characters.');
    error.statusCode = 400;
    throw error;
  }
  const room = await get(`SELECT id, building_id AS areaDbId FROM rooms WHERE room_code = ?`, [roomCode]);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }
  let nextAreaId = room.areaDbId;
  if (areaCode) {
    const area = await get(`SELECT id FROM buildings WHERE building_code = ?`, [areaCode]);
    if (!area) {
      const error = new Error('Area not found.');
      error.statusCode = 404;
      throw error;
    }
    nextAreaId = area.id;
  }
  await run(`UPDATE rooms SET room_name = ?, building_id = ? WHERE room_code = ?`, [trimmedName, nextAreaId, roomCode]);
  return get(
    `SELECT rooms.id AS roomId, rooms.room_code AS roomCode, rooms.room_name AS roomName,
            buildings.building_code AS areaCode, buildings.building_name AS areaName
     FROM rooms JOIN buildings ON buildings.id = rooms.building_id
     WHERE rooms.room_code = ?`,
    [roomCode]
  );
}

async function deleteRoom(roomCode) {
  const room = await get(`SELECT id FROM rooms WHERE room_code = ?`, [roomCode]);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }
  await run(`DELETE FROM room_reservations WHERE room_id = ?`, [room.id]);
  await run(`DELETE FROM rooms WHERE id = ?`, [room.id]);
}

async function createSeat(areaCode, seatName) {
  const trimmedName = String(seatName || '').trim();
  if (trimmedName.length < 2) {
    const error = new Error('Seat name must be at least 2 characters.');
    error.statusCode = 400;
    throw error;
  }
  const area = await get(`SELECT id FROM buildings WHERE building_code = ?`, [areaCode]);
  if (!area) {
    const error = new Error('Area not found.');
    error.statusCode = 404;
    throw error;
  }
  const orderRow = await get(`SELECT COALESCE(MAX(position_order), 0) AS maxOrder FROM seats WHERE area_id = ?`, [area.id]);
  const seatCode = await createUniqueCode('seats', 'seat_code', 'seat', trimmedName);
  const now = new Date().toISOString();
  const result = await run(
    `INSERT INTO seats (seat_code, seat_name, area_id, room_id, position_order, created_at)
     VALUES (?, ?, ?, NULL, ?, ?)`,
    [seatCode, trimmedName, area.id, (((orderRow && orderRow.maxOrder) || 0) + 1), now]
  );
  await run(
    `INSERT INTO seat_state (seat_id, occupancy_status, reservation_status, reserved_by_user_id, updated_at)
     VALUES (?, 'Free', 'Not Reserved', NULL, ?)`,
    [result.lastID, now]
  );
  return get(
    `SELECT seats.id AS seatId, seats.seat_code AS seatCode, seats.seat_name AS seatName,
            seats.position_order AS positionOrder, buildings.building_code AS areaCode, buildings.building_name AS areaName
     FROM seats JOIN buildings ON buildings.id = seats.area_id
     WHERE seats.id = ?`,
    [result.lastID]
  );
}

async function updateSeat(seatCode, payload) {
  const seat = await get(`SELECT id, area_id AS areaDbId FROM seats WHERE seat_code = ?`, [seatCode]);
  if (!seat) {
    const error = new Error('Seat not found.');
    error.statusCode = 404;
    throw error;
  }
  const nextSeatName = String(payload.seatName || '').trim();
  const nextAreaCode = String(payload.areaCode || '').trim();
  if (nextSeatName.length < 2) {
    const error = new Error('Seat name must be at least 2 characters.');
    error.statusCode = 400;
    throw error;
  }
  const area = await get(`SELECT id FROM buildings WHERE building_code = ?`, [nextAreaCode]);
  if (!area) {
    const error = new Error('Area not found.');
    error.statusCode = 404;
    throw error;
  }

  let positionOrder = await get(`SELECT position_order AS positionOrder FROM seats WHERE id = ?`, [seat.id]);
  if (area.id !== seat.areaDbId) {
    const orderRow = await get(`SELECT COALESCE(MAX(position_order), 0) AS maxOrder FROM seats WHERE area_id = ?`, [area.id]);
    positionOrder = { positionOrder: (((orderRow && orderRow.maxOrder) || 0) + 1) };
  }

  await run(
    `UPDATE seats SET seat_name = ?, area_id = ?, room_id = NULL, position_order = ? WHERE seat_code = ?`,
    [nextSeatName, area.id, positionOrder.positionOrder, seatCode]
  );
  return get(
    `SELECT seats.id AS seatId, seats.seat_code AS seatCode, seats.seat_name AS seatName,
            seats.position_order AS positionOrder, buildings.building_code AS areaCode, buildings.building_name AS areaName
     FROM seats JOIN buildings ON buildings.id = seats.area_id
     WHERE seats.seat_code = ?`,
    [seatCode]
  );
}

async function deleteSeat(seatCode) {
  const seat = await get(`SELECT id FROM seats WHERE seat_code = ?`, [seatCode]);
  if (!seat) {
    const error = new Error('Seat not found.');
    error.statusCode = 404;
    throw error;
  }
  await run(`DELETE FROM occupancy_events WHERE seat_id = ?`, [seat.id]);
  await run(`DELETE FROM reservations WHERE seat_id = ?`, [seat.id]);
  await run(`DELETE FROM seat_state WHERE seat_id = ?`, [seat.id]);
  await run(`DELETE FROM seats WHERE id = ?`, [seat.id]);
}

module.exports = {
  listAdminLayout,
  createArea,
  updateArea,
  deleteArea,
  createRoom,
  updateRoom,
  deleteRoom,
  createSeat,
  updateSeat,
  deleteSeat
};
