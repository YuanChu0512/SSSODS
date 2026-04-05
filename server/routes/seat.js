const express = require('express');

const {
  getSeatStatus,
  updateOccupancyStatus,
  listReservationSlots,
  createReservation,
  cancelReservation,
  getSeatActivity
} = require('../data/seatStore');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const VALID_OCCUPANCY_STATUSES = new Set(['Free', 'Occupied']);

function mapSeatStatus(seatState) {
  return {
    seatId: seatState.seatId,
    occupancyStatus: seatState.occupancyStatus,
    reservationStatus: seatState.reservationStatus,
    updatedAt: seatState.updatedAt,
    reservedBy: seatState.reservationStatus === 'Reserved' ? (seatState.reservedByDisplayName || null) : null,
    currentReservationId: seatState.currentReservationId || null,
    currentReservationDate: seatState.currentReservationDate || null,
    currentReservationStartTime: seatState.currentReservationStartTime || null,
    currentReservationEndTime: seatState.currentReservationEndTime || null
  };
}

router.get('/seat-status', async (req, res, next) => {
  try {
    const seatState = await getSeatStatus();
    return res.json(mapSeatStatus(seatState));
  } catch (error) {
    return next(error);
  }
});

router.get('/seat-activity', authenticate, async (req, res, next) => {
  try {
    const activity = await getSeatActivity(req.user.id);
    return res.json(activity);
  } catch (error) {
    return next(error);
  }
});

router.get('/reservations/slots', authenticate, async (req, res, next) => {
  try {
    const { date } = req.query;
    const slotData = await listReservationSlots(date, req.user.id);
    return res.json(slotData);
  } catch (error) {
    if (error.message === 'reservationDate must use YYYY-MM-DD format.') {
      return res.status(400).json({ message: error.message });
    }

    return next(error);
  }
});

router.post('/device/occupancy', async (req, res, next) => {
  try {
    const { occupancyStatus } = req.body;

    if (!VALID_OCCUPANCY_STATUSES.has(occupancyStatus)) {
      return res.status(400).json({
        message: 'occupancyStatus must be Free or Occupied.'
      });
    }

    const seatState = await updateOccupancyStatus(occupancyStatus, 'device');

    return res.json({
      message: 'Occupancy status updated successfully.',
      seat: mapSeatStatus(seatState)
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/device/seat-status', async (req, res, next) => {
  try {
    const seatState = await getSeatStatus();

    return res.json({
      seatId: seatState.seatId,
      reservationStatus: seatState.reservationStatus,
      reservedBy: seatState.reservationStatus === 'Reserved' ? (seatState.reservedByDisplayName || null) : null,
      updatedAt: seatState.updatedAt
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/reservations', authenticate, async (req, res, next) => {
  try {
    const { reservationDate, startTime, endTime } = req.body;
    const reservation = await createReservation(req.user.id, reservationDate, startTime, endTime);
    const nextSeatState = await getSeatStatus();

    return res.status(201).json({
      message: 'Reservation created successfully.',
      seat: mapSeatStatus(nextSeatState),
      reservation: {
        id: reservation.id,
        reservationDate: reservation.reservationDate,
        slotStart: reservation.startMinute !== null ? `${String(Math.floor(reservation.startMinute / 60)).padStart(2, '0')}:${String(reservation.startMinute % 60).padStart(2, '0')}` : null,
        slotEnd: reservation.endMinute !== null ? `${String(Math.floor(reservation.endMinute / 60)).padStart(2, '0')}:${String(reservation.endMinute % 60).padStart(2, '0')}` : null
      }
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (
      error.message === 'reservationDate must use YYYY-MM-DD format.' ||
      error.message === 'startTime and endTime must use 15-minute increments between 08:00 and 22:00.' ||
      error.message === 'endTime must be later than startTime.' ||
      error.message === 'A single reservation cannot exceed 6 hours.' ||
      error.message === 'Past time ranges cannot be reserved.'
    ) {
      return res.status(400).json({ message: error.message });
    }

    return next(error);
  }
});

router.delete('/reservations/:reservationId', authenticate, async (req, res, next) => {
  try {
    const reservationId = Number(req.params.reservationId);

    if (!Number.isInteger(reservationId) || reservationId <= 0) {
      return res.status(400).json({
        message: 'reservationId must be a positive integer.'
      });
    }

    const nextSeatState = await cancelReservation(reservationId, req.user.id);

    return res.json({
      message: 'Reservation cancelled successfully.',
      seat: mapSeatStatus(nextSeatState)
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

module.exports = router;
