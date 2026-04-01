const { all, get, run } = require('../db');
const { primarySeatCode } = require('../config');

async function getPrimarySeat() {
  return get(`SELECT * FROM seats WHERE seat_code = ?`, [primarySeatCode]);
}

async function getSeatStatus() {
  const seat = await getPrimarySeat();

  return get(
    `SELECT seats.seat_code AS seatId,
            seat_state.occupancy_status AS occupancyStatus,
            seat_state.reservation_status AS reservationStatus,
            seat_state.updated_at AS updatedAt,
            users.id AS reservedByUserId,
            users.username AS reservedByUsername,
            users.display_name AS reservedByDisplayName
     FROM seat_state
     JOIN seats ON seats.id = seat_state.seat_id
     LEFT JOIN users ON users.id = seat_state.reserved_by_user_id
     WHERE seat_state.seat_id = ?`,
    [seat.id]
  );
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

async function createReservation(userId) {
  const seat = await getPrimarySeat();
  const now = new Date().toISOString();

  await run(
    `UPDATE seat_state
     SET reservation_status = 'Reserved', reserved_by_user_id = ?, updated_at = ?
     WHERE seat_id = ?`,
    [userId, now, seat.id]
  );

  await run(
    `INSERT INTO reservations (seat_id, user_id, status, created_at, cancelled_at)
     VALUES (?, ?, 'Active', ?, NULL)`,
    [seat.id, userId, now]
  );

  return getSeatStatus();
}

async function cancelReservation() {
  const seat = await getPrimarySeat();
  const now = new Date().toISOString();

  await run(
    `UPDATE reservations
     SET status = 'Cancelled', cancelled_at = ?
     WHERE seat_id = ? AND status = 'Active'`,
    [now, seat.id]
  );

  await run(
    `UPDATE seat_state
     SET reservation_status = 'Not Reserved', reserved_by_user_id = NULL, updated_at = ?
     WHERE seat_id = ?`,
    [now, seat.id]
  );

  return getSeatStatus();
}

async function getSeatActivity() {
  const seat = await getPrimarySeat();

  const recentReservations = await all(
    `SELECT reservations.id,
            reservations.status,
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
    recentReservations,
    recentOccupancyEvents
  };
}

module.exports = {
  getSeatStatus,
  updateOccupancyStatus,
  createReservation,
  cancelReservation,
  getSeatActivity
};
