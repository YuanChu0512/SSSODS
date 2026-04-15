const express = require('express');

const {
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
} = require('../data/seatStore');
const { authenticate } = require('../middleware/auth');
const { primarySeatCode } = require('../config');

const router = express.Router();
const VALID_OCCUPANCY_STATUSES = new Set(['Free', 'Occupied']);

function resolveSeatCode(inputSeatCode) {
  return inputSeatCode || primarySeatCode;
}

function mapAreaPayload(area) {
  const rooms = (area.rooms || []).map((room) => ({
    ...room,
    areaCode: area.buildingCode,
    areaName: area.buildingName
  }));
  const seats = (area.seats || []).map((seat) => ({
    ...seat,
    areaCode: area.buildingCode,
    areaName: area.buildingName,
    roomCode: seat.roomCode || null,
    roomName: seat.roomName || null
  }));

  return {
    areaCode: area.buildingCode,
    areaName: area.buildingName,
    rooms,
    seats
  };
}

router.get('/rooms', authenticate, async (req, res, next) => {
  try {
    const rawAreas = await listBuildingsWithRoomsAndSeats(req.user.id);
    const areas = rawAreas.map(mapAreaPayload);
    const rooms = areas.flatMap((area) => area.rooms || []);
    return res.json({ areas, rooms });
  } catch (error) {
    return next(error);
  }
});

router.get('/room-status', authenticate, async (req, res, next) => {
  try {
    const roomStatusRaw = await getRoomStatus(req.query.roomCode, req.user.id);
    const roomStatus = {
      ...roomStatusRaw,
      areaCode: roomStatusRaw.buildingCode || null,
      areaName: roomStatusRaw.buildingName || null
    };
    return res.json(roomStatus);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

router.get('/seat-status', authenticate, async (req, res, next) => {
  try {
    const seatState = await getSeatStatus(resolveSeatCode(req.query.seatId), req.user.id);
    return res.json(seatState);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

router.get('/seat-activity', authenticate, async (req, res, next) => {
  try {
    const activity = await getSeatActivity(resolveSeatCode(req.query.seatId), req.user.id);
    return res.json(activity);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

router.get('/reservations/slots', authenticate, async (req, res, next) => {
  try {
    const { date, seatId } = req.query;
    const slotData = await listReservationSlots(resolveSeatCode(seatId), date, req.user.id);
    return res.json(slotData);
  } catch (error) {
    if (
      error.message === 'reservationDate must use YYYY-MM-DD format.' ||
      error.message === 'Seat not found.'
    ) {
      return res.status(error.statusCode || 400).json({ message: error.message });
    }

    return next(error);
  }
});

router.post('/device/occupancy', async (req, res, next) => {
  try {
    const { occupancyStatus, seatId } = req.body;

    if (!VALID_OCCUPANCY_STATUSES.has(occupancyStatus)) {
      return res.status(400).json({
        message: 'occupancyStatus must be Free or Occupied.'
      });
    }

    const seatState = await updateOccupancyStatus(occupancyStatus, 'device', resolveSeatCode(seatId));

    return res.json({
      message: 'Occupancy status updated successfully.',
      seat: seatState
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

router.get('/device/seat-status', async (req, res, next) => {
  try {
    const seatState = await getSeatStatus(resolveSeatCode(req.query.seatId));

    return res.json({
      seatId: seatState.seatId,
      reservationStatus: seatState.reservationStatus,
      reservedBy: seatState.reservedBy || null,
      updatedAt: seatState.updatedAt
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

router.post('/reservations', authenticate, async (req, res, next) => {
  try {
    const { seatId, reservationDate, startTime, endTime } = req.body;
    const reservation = await createReservation(
      req.user.id,
      resolveSeatCode(seatId),
      reservationDate,
      startTime,
      endTime
    );
    const nextSeatState = await getSeatStatus(resolveSeatCode(seatId), req.user.id);

    return res.status(201).json({
      message: 'Reservation created successfully.',
      seat: nextSeatState,
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

router.get('/room-reservations/slots', authenticate, async (req, res, next) => {
  try {
    const { date, roomCode } = req.query;
    const slotDataRaw = await listRoomReservationSlots(roomCode, date, req.user.id);
    const slotData = {
      ...slotDataRaw,
      areaCode: slotDataRaw.buildingCode || null,
      areaName: slotDataRaw.buildingName || null
    };
    return res.json(slotData);
  } catch (error) {
    if (
      error.message === 'reservationDate must use YYYY-MM-DD format.' ||
      error.message === 'Room not found.'
    ) {
      return res.status(error.statusCode || 400).json({ message: error.message });
    }

    return next(error);
  }
});

router.post('/room-reservations', authenticate, async (req, res, next) => {
  try {
    const { roomCode, reservationDate, startTime, endTime } = req.body;
    const reservation = await createRoomReservation(
      req.user.id,
      roomCode,
      reservationDate,
      startTime,
      endTime
    );
    const nextRoomStateRaw = await getRoomStatus(roomCode, req.user.id);
    const nextRoomState = {
      ...nextRoomStateRaw,
      areaCode: nextRoomStateRaw.buildingCode || null,
      areaName: nextRoomStateRaw.buildingName || null
    };

    return res.status(201).json({
      message: 'Room reservation created successfully.',
      room: nextRoomState,
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
      error.message === 'Past time ranges cannot be reserved.' ||
      error.message === 'Room not found.'
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
      seat: nextSeatState
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

router.delete('/room-reservations/:reservationId', authenticate, async (req, res, next) => {
  try {
    const reservationId = Number(req.params.reservationId);

    if (!Number.isInteger(reservationId) || reservationId <= 0) {
      return res.status(400).json({
        message: 'reservationId must be a positive integer.'
      });
    }

    const nextRoomStateRaw = await cancelRoomReservation(reservationId, req.user.id);
    const nextRoomState = {
      ...nextRoomStateRaw,
      areaCode: nextRoomStateRaw.buildingCode || null,
      areaName: nextRoomStateRaw.buildingName || null
    };

    return res.json({
      message: 'Room reservation cancelled successfully.',
      room: nextRoomState
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return next(error);
  }
});

module.exports = router;
