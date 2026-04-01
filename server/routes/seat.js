const express = require('express');

const {
  getSeatStatus,
  updateOccupancyStatus,
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
    reservedBy: seatState.reservedByDisplayName || seatState.reservedByUsername || null,
    reservedByUserId: seatState.reservedByUserId || null
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

router.get('/seat-activity', async (req, res, next) => {
  try {
    const activity = await getSeatActivity();
    return res.json(activity);
  } catch (error) {
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
      reservedBy: seatState.reservedByDisplayName || seatState.reservedByUsername || null,
      updatedAt: seatState.updatedAt
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/reservations', authenticate, async (req, res, next) => {
  try {
    const seatState = await getSeatStatus();

    if (seatState.reservationStatus === 'Reserved') {
      return res.status(409).json({
        message: 'This seat is already reserved.',
        seat: mapSeatStatus(seatState)
      });
    }

    const nextSeatState = await createReservation(req.user.id);

    return res.status(201).json({
      message: 'Reservation created successfully.',
      seat: mapSeatStatus(nextSeatState)
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/reservations/current', authenticate, async (req, res, next) => {
  try {
    const seatState = await getSeatStatus();

    if (seatState.reservationStatus === 'Not Reserved') {
      return res.status(409).json({
        message: 'There is no active reservation to cancel.',
        seat: mapSeatStatus(seatState)
      });
    }

    if (seatState.reservedByUserId && seatState.reservedByUserId !== req.user.id) {
      return res.status(403).json({
        message: 'Only the user who reserved the seat can cancel it.'
      });
    }

    const nextSeatState = await cancelReservation();

    return res.json({
      message: 'Reservation cancelled successfully.',
      seat: mapSeatStatus(nextSeatState)
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
