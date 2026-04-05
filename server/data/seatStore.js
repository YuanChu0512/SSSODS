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
    minuteOfDay: Number(parts.hour) * 60 + Number(parts.minute),
    isoString: new Date().toISOString()
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

async function getPrimarySeat() {
  return get(`SELECT * FROM seats WHERE seat_code = ?`, [primarySeatCode]);
}

async function getCurrentReservationContext(seatId) {
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

  return reservation || null;
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

async function getSeatStatus() {
  const seat = await getPrimarySeat();
  const seatState = await get(
    `SELECT seats.seat_code AS seatId,
            seat_state.occupancy_status AS occupancyStatus,
            seat_state.updated_at AS updatedAt
     FROM seat_state
     JOIN seats ON seats.id = seat_state.seat_id
     WHERE seat_state.seat_id = ?`,
    [seat.id]
  );
  const currentReservation = await getCurrentReservationContext(seat.id);

  return {
    ...seatState,
    reservationStatus: currentReservation ? 'Reserved' : 'Not Reserved',
    reservedByUserId: currentReservation ? currentReservation.reservedByUserId : null,
    reservedByUsername: currentReservation ? currentReservation.reservedByUsername : null,
    reservedByDisplayName: currentReservation ? getMaskedOwner(currentReservation, null) : null,
    currentReservationId: currentReservation ? currentReservation.id : null,
    currentReservationDate: currentReservation ? currentReservation.reservationDate : null,
    currentReservationStartTime: currentReservation ? formatMinute(currentReservation.startMinute) : null,
    currentReservationEndTime: currentReservation ? formatMinute(currentReservation.endMinute) : null
  };
}

async function updateOccupancyStatus(nextStatus, source = 'device') {
  const seat = await getPrimarySeat();
  const now = new Date().toISOString();

  await run(
    `UPDATE seat_state SET occupancy_status = ?, updated_at = ? WHERE seat_id = ?`,
    [nextStatus, now, seat.id]
  );

  await run(
    `INSERT INTO occupancy_events (seat_id, occupancy_status, source, created_at)
     VALUES (?, ?, ?, ?)`,
    [seat.id, nextStatus, source, now]
  );

  return getSeatStatus();
}

async function listReservationSlots(reservationDate, userId = null) {
  if (!isValidReservationDate(reservationDate)) {
    throw new Error('reservationDate must use YYYY-MM-DD format.');
  }

  const seat = await getPrimarySeat();
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
    seatId: seat.seat_code,
    reservationDate,
    openingTime: formatMinute(OPENING_MINUTE),
    closingTime: formatMinute(CLOSING_MINUTE),
    slotDurationMinute: SLOT_DURATION_MINUTE,
    slots
  };
}

async function createReservation(userId, reservationDate, startTime, endTime) {
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

  const seat = await getPrimarySeat();
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
            reservations.reservation_date AS reservationDate,
            reservations.start_minute AS startMinute,
            reservations.end_minute AS endMinute,
            reservations.status,
            users.id AS reservedByUserId,
            users.username AS reservedByUsername,
            users.display_name AS reservedByDisplayName
     FROM reservations
     JOIN users ON users.id = reservations.user_id
     WHERE reservations.id = ?`,
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

  const now = new Date().toISOString();
  const seat = await getPrimarySeat();

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
    [now, seat.id]
  );

  return getSeatStatus();
}

async function getSeatActivity(userId = null) {
  const seat = await getPrimarySeat();

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
  updateOccupancyStatus,
  listReservationSlots,
  createReservation,
  cancelReservation,
  getSeatActivity
};
