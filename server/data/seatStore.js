const { all, get, run } = require('../db');
const { primarySeatCode } = require('../config');

const OPENING_MINUTE = 8 * 60;
const CLOSING_MINUTE = 22 * 60;
const SLOT_DURATION_MINUTE = 15;
const MAX_RESERVATION_MINUTE = 6 * 60;
const SHANGHAI_TIME_ZONE = 'Asia/Shanghai';

function formatMinute(minute) {
  const hours = String(Math.floor(minute / 60)).padStart(2, '0');
  const mins = String(minute % 60).padStart(2, '0');
  return `${hours}:${mins}`;
}

function getShanghaiNow() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: SHANGHAI_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(new Date()).reduce((result, part) => {
    if (part.type !== 'literal') {
      result[part.type] = part.value;
    }

    return result;
  }, {});

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minuteOfDay: Number(parts.hour) * 60 + Number(parts.minute)
  };
}

function isValidReservationDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseSlotTime(slotTime) {
  if (typeof slotTime !== 'string') {
    return null;
  }

  const matched = slotTime.match(/^(\d{2}):(\d{2})$/);

  if (!matched) {
    return null;
  }

  const hours = Number(matched[1]);
  const minutes = Number(matched[2]);
  const totalMinute = (hours * 60) + minutes;

  if (
    Number.isNaN(totalMinute) ||
    totalMinute < OPENING_MINUTE ||
    totalMinute > CLOSING_MINUTE ||
    minutes % SLOT_DURATION_MINUTE !== 0
  ) {
    return null;
  }

  return totalMinute;
}

function getMaskedOwner(reservation, currentUserId) {
  if (!reservation) {
    return null;
  }

  const visibleName = reservation.reservedByDisplayName || reservation.reservedByUsername || '';

  if (currentUserId && reservation.reservedByUserId === currentUserId) {
    return visibleName || null;
  }

  if (!visibleName) {
    return null;
  }

  return `${visibleName.slice(0, 1)}**`;
}

function normalizeSeatSummary(row) {
  return {
    buildingCode: row.buildingCode || null,
    buildingName: row.buildingName || null,
    seatId: row.seatId,
    seatName: row.seatName,
    roomCode: row.roomCode,
    roomName: row.roomName,
    occupancyStatus: row.occupancyStatus,
    reservationStatus: row.reservationStatus,
    updatedAt: row.updatedAt,
    reservedBy: row.reservedBy || null,
    currentReservationId: row.currentReservationId || null,
    currentReservationDate: row.currentReservationDate || null,
    currentReservationStartTime: row.currentReservationStartTime || null,
    currentReservationEndTime: row.currentReservationEndTime || null
  };
}

async function getSeatByCode(seatCode = primarySeatCode) {
  const seat = await get(
    `SELECT seats.id,
            seats.seat_code AS seatId,
            seats.seat_name AS seatName,
            seats.position_order AS positionOrder,
            buildings.building_code AS buildingCode,
            buildings.building_name AS buildingName,
            rooms.room_code AS roomCode,
            rooms.room_name AS roomName
     FROM seats
     LEFT JOIN buildings ON buildings.id = seats.area_id
     LEFT JOIN rooms ON rooms.id = seats.room_id
     WHERE seats.seat_code = ?`,
    [seatCode]
  );

  if (!seat) {
    const error = new Error('Seat not found.');
    error.statusCode = 404;
    throw error;
  }

  return seat;
}

async function getRoomByCode(roomCode) {
  const room = await get(
    `SELECT rooms.id,
            rooms.room_code AS roomCode,
            rooms.room_name AS roomName,
            buildings.building_code AS buildingCode,
            buildings.building_name AS buildingName
     FROM rooms
     LEFT JOIN buildings ON buildings.id = rooms.building_id
     WHERE rooms.room_code = ?`,
    [roomCode]
  );

  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }

  return room;
}

async function getCurrentReservationContext(seatId, currentUserId = null) {
  const now = getShanghaiNow();

  const reservation = await get(
    `SELECT reservations.id,
            reservations.user_id AS reservedByUserId,
            reservations.reservation_date AS reservationDate,
            reservations.start_minute AS startMinute,
            reservations.end_minute AS endMinute,
            users.username AS reservedByUsername,
            users.display_name AS reservedByDisplayName
     FROM reservations
     JOIN users ON users.id = reservations.user_id
     WHERE reservations.seat_id = ?
       AND reservations.status = 'Active'
       AND reservations.reservation_date = ?
       AND reservations.start_minute <= ?
       AND reservations.end_minute > ?
     ORDER BY reservations.start_minute ASC
     LIMIT 1`,
    [seatId, now.date, now.minuteOfDay, now.minuteOfDay]
  );

  if (!reservation) {
    return null;
  }

  return {
    ...reservation,
    visibleReservedBy: getMaskedOwner(reservation, currentUserId)
  };
}

async function getCurrentRoomReservationContext(roomId, currentUserId = null) {
  const now = getShanghaiNow();

  const reservation = await get(
    `SELECT room_reservations.id,
            room_reservations.user_id AS reservedByUserId,
            room_reservations.reservation_date AS reservationDate,
            room_reservations.start_minute AS startMinute,
            room_reservations.end_minute AS endMinute,
            users.username AS reservedByUsername,
            users.display_name AS reservedByDisplayName
     FROM room_reservations
     JOIN users ON users.id = room_reservations.user_id
     WHERE room_reservations.room_id = ?
       AND room_reservations.status = 'Active'
       AND room_reservations.reservation_date = ?
       AND room_reservations.start_minute <= ?
       AND room_reservations.end_minute > ?
     ORDER BY room_reservations.start_minute ASC
     LIMIT 1`,
    [roomId, now.date, now.minuteOfDay, now.minuteOfDay]
  );

  if (!reservation) {
    return null;
  }

  return {
    id: reservation.id,
    visibleReservedBy: getMaskedOwner(reservation, currentUserId),
    reservationDate: reservation.reservationDate,
    startMinute: reservation.startMinute,
    endMinute: reservation.endMinute,
    reservedByUserId: reservation.reservedByUserId
  };
}

async function getSeatStatus(seatCode = primarySeatCode, currentUserId = null) {
  const seat = await getSeatByCode(seatCode);
  const seatState = await get(
    `SELECT seat_state.occupancy_status AS occupancyStatus,
            seat_state.updated_at AS updatedAt
     FROM seat_state
     WHERE seat_state.seat_id = ?`,
    [seat.id]
  );
  const currentReservation = await getCurrentReservationContext(seat.id, currentUserId);

  return normalizeSeatSummary({
    ...seat,
    ...seatState,
    reservationStatus: currentReservation ? 'Reserved' : 'Not Reserved',
    reservedBy: currentReservation ? currentReservation.visibleReservedBy : null,
    reservedByUserId: currentReservation ? currentReservation.reservedByUserId : null,
    currentReservationId: currentReservation ? currentReservation.id : null,
    currentReservationDate: currentReservation ? currentReservation.reservationDate : null,
    currentReservationStartTime: currentReservation ? formatMinute(currentReservation.startMinute) : null,
    currentReservationEndTime: currentReservation ? formatMinute(currentReservation.endMinute) : null
  });
}

async function listBuildingsWithRoomsAndSeats(currentUserId = null) {
  const buildings = await all(
    `SELECT building_code AS buildingCode, building_name AS buildingName
     FROM buildings
     ORDER BY building_name ASC`
  );
  const rooms = await all(
    `SELECT rooms.id,
            rooms.room_code AS roomCode,
            rooms.room_name AS roomName,
            buildings.building_code AS buildingCode,
            buildings.building_name AS buildingName
     FROM rooms
     LEFT JOIN buildings ON buildings.id = rooms.building_id
     ORDER BY buildings.building_name ASC, rooms.room_name ASC`
  );

  const seats = await all(
    `SELECT seats.id,
            seats.seat_code AS seatId,
            seats.seat_name AS seatName,
            seats.position_order AS positionOrder,
            buildings.building_code AS buildingCode,
            buildings.building_name AS buildingName,
            rooms.room_code AS roomCode,
            rooms.room_name AS roomName,
            seat_state.occupancy_status AS occupancyStatus,
            seat_state.updated_at AS updatedAt
     FROM seats
     LEFT JOIN buildings ON buildings.id = seats.area_id
     LEFT JOIN rooms ON rooms.id = seats.room_id
     JOIN seat_state ON seat_state.seat_id = seats.id
     ORDER BY buildings.building_name ASC, seats.position_order ASC, seats.seat_code ASC`
  );

  const buildingMap = new Map();

  for (const building of buildings) {
    buildingMap.set(building.buildingCode, {
      buildingCode: building.buildingCode,
      buildingName: building.buildingName,
      rooms: [],
      seats: []
    });
  }

  for (const room of rooms) {
    let building = buildingMap.get(room.buildingCode);
    if (!building) {
      building = {
        buildingCode: room.buildingCode || 'area-unassigned',
        buildingName: room.buildingName || 'Unassigned Area',
        rooms: [],
        seats: []
      };
      buildingMap.set(building.buildingCode, building);
    }

    building.rooms.push({
      roomCode: room.roomCode,
      roomName: room.roomName,
      reservationStatus: 'Not Reserved',
      reservedBy: null,
      currentReservationId: null,
      currentReservationDate: null,
      currentReservationStartTime: null,
      currentReservationEndTime: null
    });
  }

  for (const seat of seats) {
    const currentReservation = await getCurrentReservationContext(seat.id, currentUserId);
    let building = buildingMap.get(seat.buildingCode);
    if (!building) {
      building = {
        buildingCode: seat.buildingCode || 'area-unassigned',
        buildingName: seat.buildingName || 'Unassigned Area',
        rooms: [],
        seats: []
      };
      buildingMap.set(building.buildingCode, building);
    }

    building.seats.push(normalizeSeatSummary({
      ...seat,
      reservationStatus: currentReservation ? 'Reserved' : 'Not Reserved',
      reservedBy: currentReservation ? currentReservation.visibleReservedBy : null,
      currentReservationId: currentReservation ? currentReservation.id : null,
      currentReservationDate: currentReservation ? currentReservation.reservationDate : null,
      currentReservationStartTime: currentReservation ? formatMinute(currentReservation.startMinute) : null,
      currentReservationEndTime: currentReservation ? formatMinute(currentReservation.endMinute) : null
    }));
  }

  for (const building of buildingMap.values()) {
    for (const room of building.rooms) {
      const roomRecord = await getRoomByCode(room.roomCode);
      const roomReservation = await getCurrentRoomReservationContext(roomRecord.id, currentUserId);
      room.reservationStatus = roomReservation ? 'Reserved' : 'Not Reserved';
      room.reservedBy = roomReservation ? roomReservation.visibleReservedBy : null;
      room.currentReservationId = roomReservation ? roomReservation.id : null;
      room.currentReservationDate = roomReservation ? roomReservation.reservationDate : null;
      room.currentReservationStartTime = roomReservation ? formatMinute(roomReservation.startMinute) : null;
      room.currentReservationEndTime = roomReservation ? formatMinute(roomReservation.endMinute) : null;
    }
  }

  return Array.from(buildingMap.values());
}

async function getRoomStatus(roomCode, currentUserId = null) {
  const room = await getRoomByCode(roomCode);
  const currentReservation = await getCurrentRoomReservationContext(room.id, currentUserId);

  return {
    buildingCode: room.buildingCode || null,
    buildingName: room.buildingName || null,
    roomCode: room.roomCode,
    roomName: room.roomName,
    reservationStatus: currentReservation ? 'Reserved' : 'Not Reserved',
    reservedBy: currentReservation ? currentReservation.visibleReservedBy : null,
    currentReservationId: currentReservation ? currentReservation.id : null,
    currentReservationDate: currentReservation ? currentReservation.reservationDate : null,
    currentReservationStartTime: currentReservation ? formatMinute(currentReservation.startMinute) : null,
    currentReservationEndTime: currentReservation ? formatMinute(currentReservation.endMinute) : null
  };
}

async function updateOccupancyStatus(nextStatus, source = 'device', seatCode = primarySeatCode) {
  const now = new Date().toISOString();
  const seats = await all(
    `SELECT seats.id, seats.seat_code AS seatId
     FROM seats
     ORDER BY seats.seat_code ASC`
  );

  for (const seat of seats) {
    await run(
      `UPDATE seat_state SET occupancy_status = ?, updated_at = ? WHERE seat_id = ?`,
      [nextStatus, now, seat.id]
    );

    await run(
      `INSERT INTO occupancy_events (seat_id, occupancy_status, source, created_at)
       VALUES (?, ?, ?, ?)`,
      [seat.id, nextStatus, source, now]
    );
  }

  return getSeatStatus(seatCode);
}

async function listReservationSlots(seatCode, reservationDate, userId = null) {
  if (!isValidReservationDate(reservationDate)) {
    throw new Error('reservationDate must use YYYY-MM-DD format.');
  }

  const seat = await getSeatByCode(seatCode);
  const now = getShanghaiNow();
  const reservations = await all(
    `SELECT reservations.id,
            reservations.user_id AS reservedByUserId,
            reservations.start_minute AS startMinute,
            reservations.end_minute AS endMinute,
            users.username AS reservedByUsername,
            users.display_name AS reservedByDisplayName
     FROM reservations
     JOIN users ON users.id = reservations.user_id
     WHERE reservations.seat_id = ?
       AND reservations.status = 'Active'
       AND reservations.reservation_date = ?
     ORDER BY reservations.start_minute ASC`,
    [seat.id, reservationDate]
  );

  const slots = [];

  for (let minute = OPENING_MINUTE; minute < CLOSING_MINUTE; minute += SLOT_DURATION_MINUTE) {
    const slotReservation = reservations.find(
      (reservation) => reservation.startMinute <= minute && reservation.endMinute > minute
    ) || null;
    const startTime = formatMinute(minute);
    const endTime = formatMinute(minute + SLOT_DURATION_MINUTE);
    const isPast = reservationDate < now.date || (reservationDate === now.date && minute < now.minuteOfDay);
    const isReserved = Boolean(slotReservation);

    slots.push({
      slotStart: startTime,
      slotEnd: endTime,
      label: `${startTime} - ${endTime}`,
      reservationId: slotReservation ? slotReservation.id : null,
      reservationStatus: isReserved ? 'Reserved' : (isPast ? 'Past' : 'Available'),
      reservationStartTime: slotReservation ? formatMinute(slotReservation.startMinute) : null,
      reservationEndTime: slotReservation ? formatMinute(slotReservation.endMinute) : null,
      reservationLabel: slotReservation
        ? `${formatMinute(slotReservation.startMinute)} - ${formatMinute(slotReservation.endMinute)}`
        : null,
      reservedBy: slotReservation ? getMaskedOwner(slotReservation, userId) : null,
      isOwnedByCurrentUser: Boolean(
        userId && slotReservation && slotReservation.reservedByUserId === userId
      )
    });
  }

  return {
    seatId: seat.seatId,
    seatName: seat.seatName,
    roomCode: seat.roomCode,
    roomName: seat.roomName,
    reservationDate,
    openingTime: formatMinute(OPENING_MINUTE),
    closingTime: formatMinute(CLOSING_MINUTE),
    slotDurationMinute: SLOT_DURATION_MINUTE,
    slots
  };
}

async function listRoomReservationSlots(roomCode, reservationDate, userId = null) {
  if (!isValidReservationDate(reservationDate)) {
    throw new Error('reservationDate must use YYYY-MM-DD format.');
  }

  const room = await getRoomByCode(roomCode);
  const now = getShanghaiNow();
  const reservations = await all(
    `SELECT room_reservations.id,
            room_reservations.user_id AS reservedByUserId,
            room_reservations.start_minute AS startMinute,
            room_reservations.end_minute AS endMinute,
            users.username AS reservedByUsername,
            users.display_name AS reservedByDisplayName
     FROM room_reservations
     JOIN users ON users.id = room_reservations.user_id
     WHERE room_reservations.room_id = ?
       AND room_reservations.status = 'Active'
       AND room_reservations.reservation_date = ?
     ORDER BY room_reservations.start_minute ASC`,
    [room.id, reservationDate]
  );

  const slots = [];

  for (let minute = OPENING_MINUTE; minute < CLOSING_MINUTE; minute += SLOT_DURATION_MINUTE) {
    const slotReservation = reservations.find(
      (reservation) => reservation.startMinute <= minute && reservation.endMinute > minute
    ) || null;
    const startTime = formatMinute(minute);
    const endTime = formatMinute(minute + SLOT_DURATION_MINUTE);
    const isPast = reservationDate < now.date || (reservationDate === now.date && minute < now.minuteOfDay);
    const isReserved = Boolean(slotReservation);

    slots.push({
      slotStart: startTime,
      slotEnd: endTime,
      label: `${startTime} - ${endTime}`,
      reservationId: slotReservation ? slotReservation.id : null,
      reservationStatus: isReserved ? 'Reserved' : (isPast ? 'Past' : 'Available'),
      reservationStartTime: slotReservation ? formatMinute(slotReservation.startMinute) : null,
      reservationEndTime: slotReservation ? formatMinute(slotReservation.endMinute) : null,
      reservationLabel: slotReservation
        ? `${formatMinute(slotReservation.startMinute)} - ${formatMinute(slotReservation.endMinute)}`
        : null,
      reservedBy: slotReservation ? getMaskedOwner(slotReservation, userId) : null,
      isOwnedByCurrentUser: Boolean(
        userId && slotReservation && slotReservation.reservedByUserId === userId
      )
    });
  }

  return {
    buildingCode: room.buildingCode || null,
    buildingName: room.buildingName || null,
    roomCode: room.roomCode,
    roomName: room.roomName,
    reservationDate,
    openingTime: formatMinute(OPENING_MINUTE),
    closingTime: formatMinute(CLOSING_MINUTE),
    slotDurationMinute: SLOT_DURATION_MINUTE,
    slots
  };
}

async function createReservation(userId, seatCode, reservationDate, startTime, endTime) {
  if (!isValidReservationDate(reservationDate)) {
    throw new Error('reservationDate must use YYYY-MM-DD format.');
  }

  const startMinute = parseSlotTime(startTime);
  const endMinute = parseSlotTime(endTime);

  if (startMinute === null || endMinute === null) {
    throw new Error('startTime and endTime must use 15-minute increments between 08:00 and 22:00.');
  }

  if (startMinute >= endMinute) {
    throw new Error('endTime must be later than startTime.');
  }

  if ((endMinute - startMinute) > MAX_RESERVATION_MINUTE) {
    throw new Error('A single reservation cannot exceed 6 hours.');
  }

  const now = getShanghaiNow();

  if (reservationDate < now.date || (reservationDate === now.date && startMinute < now.minuteOfDay)) {
    throw new Error('Past time ranges cannot be reserved.');
  }

  const seat = await getSeatByCode(seatCode);
  const existingReservation = await get(
    `SELECT id
     FROM reservations
     WHERE seat_id = ?
       AND reservation_date = ?
       AND status = 'Active'
       AND start_minute < ?
       AND end_minute > ?
     LIMIT 1`,
    [seat.id, reservationDate, endMinute, startMinute]
  );

  if (existingReservation) {
    const conflictError = new Error('The selected time range overlaps an existing reservation.');
    conflictError.statusCode = 409;
    throw conflictError;
  }

  const createdAt = new Date().toISOString();
  const result = await run(
    `INSERT INTO reservations (
        seat_id,
        user_id,
        reservation_date,
        start_minute,
        end_minute,
        status,
        created_at,
        cancelled_at
      ) VALUES (?, ?, ?, ?, ?, 'Active', ?, NULL)`,
    [seat.id, userId, reservationDate, startMinute, endMinute, createdAt]
  );

  await run(
    `UPDATE seat_state
     SET updated_at = ?
     WHERE seat_id = ?`,
    [createdAt, seat.id]
  );

  return get(
    `SELECT reservations.id,
            reservations.seat_id AS seatDbId,
            reservations.reservation_date AS reservationDate,
            reservations.start_minute AS startMinute,
            reservations.end_minute AS endMinute
     FROM reservations
     WHERE reservations.id = ?`,
    [result.lastID]
  );
}

async function createRoomReservation(userId, roomCode, reservationDate, startTime, endTime) {
  if (!isValidReservationDate(reservationDate)) {
    throw new Error('reservationDate must use YYYY-MM-DD format.');
  }

  const startMinute = parseSlotTime(startTime);
  const endMinute = parseSlotTime(endTime);

  if (startMinute === null || endMinute === null) {
    throw new Error('startTime and endTime must use 15-minute increments between 08:00 and 22:00.');
  }

  if (startMinute >= endMinute) {
    throw new Error('endTime must be later than startTime.');
  }

  if ((endMinute - startMinute) > MAX_RESERVATION_MINUTE) {
    throw new Error('A single reservation cannot exceed 6 hours.');
  }

  const now = getShanghaiNow();

  if (reservationDate < now.date || (reservationDate === now.date && startMinute < now.minuteOfDay)) {
    throw new Error('Past time ranges cannot be reserved.');
  }

  const room = await getRoomByCode(roomCode);
  const existingReservation = await get(
    `SELECT id
     FROM room_reservations
     WHERE room_id = ?
       AND reservation_date = ?
       AND status = 'Active'
       AND start_minute < ?
       AND end_minute > ?
     LIMIT 1`,
    [room.id, reservationDate, endMinute, startMinute]
  );

  if (existingReservation) {
    const conflictError = new Error('The selected time range overlaps an existing reservation.');
    conflictError.statusCode = 409;
    throw conflictError;
  }

  const createdAt = new Date().toISOString();
  const result = await run(
    `INSERT INTO room_reservations (
        room_id,
        user_id,
        reservation_date,
        start_minute,
        end_minute,
        status,
        created_at,
        cancelled_at
      ) VALUES (?, ?, ?, ?, ?, 'Active', ?, NULL)`,
    [room.id, userId, reservationDate, startMinute, endMinute, createdAt]
  );

  return get(
    `SELECT id,
            room_id AS roomDbId,
            reservation_date AS reservationDate,
            start_minute AS startMinute,
            end_minute AS endMinute
     FROM room_reservations
     WHERE id = ?`,
    [result.lastID]
  );
}

async function cancelReservation(reservationId, userId) {
  const reservation = await get(
    `SELECT *
     FROM reservations
     WHERE id = ?
       AND status = 'Active'`,
    [reservationId]
  );

  if (!reservation) {
    const missingError = new Error('The selected reservation could not be found.');
    missingError.statusCode = 404;
    throw missingError;
  }

  if (reservation.user_id !== userId) {
    const forbiddenError = new Error('Only the user who reserved the slot can cancel it.');
    forbiddenError.statusCode = 403;
    throw forbiddenError;
  }

  const seat = await get(
    `SELECT seat_code AS seatId
     FROM seats
     WHERE id = ?`,
    [reservation.seat_id]
  );
  const now = new Date().toISOString();

  await run(
    `UPDATE reservations
     SET status = 'Cancelled', cancelled_at = ?
     WHERE id = ?`,
    [now, reservationId]
  );

  await run(
    `UPDATE seat_state
     SET updated_at = ?
     WHERE seat_id = ?`,
    [now, reservation.seat_id]
  );

  return getSeatStatus(seat.seatId, userId);
}

async function cancelRoomReservation(reservationId, userId) {
  const reservation = await get(
    `SELECT *
     FROM room_reservations
     WHERE id = ?
       AND status = 'Active'`,
    [reservationId]
  );

  if (!reservation) {
    const missingError = new Error('The selected reservation could not be found.');
    missingError.statusCode = 404;
    throw missingError;
  }

  if (reservation.user_id !== userId) {
    const forbiddenError = new Error('Only the user who reserved the slot can cancel it.');
    forbiddenError.statusCode = 403;
    throw forbiddenError;
  }

  const room = await get(
    `SELECT room_code AS roomCode
     FROM rooms
     WHERE id = ?`,
    [reservation.room_id]
  );
  const now = new Date().toISOString();

  await run(
    `UPDATE room_reservations
     SET status = 'Cancelled', cancelled_at = ?
     WHERE id = ?`,
    [now, reservationId]
  );

  return getRoomStatus(room.roomCode, userId);
}

async function getSeatActivity(seatCode = primarySeatCode, userId = null) {
  const seat = await getSeatByCode(seatCode);

  const recentReservations = await all(
    `SELECT reservations.id,
            reservations.user_id AS userId,
            reservations.status,
            reservations.reservation_date AS reservationDate,
            reservations.start_minute AS startMinute,
            reservations.end_minute AS endMinute,
            reservations.created_at AS createdAt,
            reservations.cancelled_at AS cancelledAt,
            users.username,
            users.display_name AS displayName
     FROM reservations
     JOIN users ON users.id = reservations.user_id
     WHERE reservations.seat_id = ?
     ORDER BY reservations.id DESC
     LIMIT 10`,
    [seat.id]
  );

  const recentOccupancyEvents = await all(
    `SELECT id, occupancy_status AS occupancyStatus, source, created_at AS createdAt
     FROM occupancy_events
     WHERE seat_id = ?
     ORDER BY id DESC
     LIMIT 10`,
    [seat.id]
  );

  return {
    seatId: seat.seatId,
    seatName: seat.seatName,
    roomCode: seat.roomCode,
    roomName: seat.roomName,
    recentReservations: recentReservations.map((reservation) => ({
      ...reservation,
      displayName: userId && reservation.userId === userId
        ? (reservation.displayName || reservation.username)
        : ((reservation.displayName || reservation.username) ? `${(reservation.displayName || reservation.username).slice(0, 1)}**` : null),
      username: userId && reservation.userId === userId ? reservation.username : null,
      isOwnedByCurrentUser: Boolean(userId && reservation.userId === userId),
      slotLabel: Number.isInteger(reservation.startMinute) && Number.isInteger(reservation.endMinute)
        ? `${formatMinute(reservation.startMinute)} - ${formatMinute(reservation.endMinute)}`
        : null
    })),
    recentOccupancyEvents
  };
}

module.exports = {
  getSeatStatus,
  listBuildingsWithRoomsAndSeats,
  getRoomStatus,
  updateOccupancyStatus,
  listReservationSlots,
  listRoomReservationSlots,
  createReservation,
  createRoomReservation,
  cancelReservation,
  cancelRoomReservation,
  getSeatActivity
};
