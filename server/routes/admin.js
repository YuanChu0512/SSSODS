const express = require('express');

const { authenticate, requireAdmin } = require('../middleware/auth');
const {
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
} = require('../data/adminStore');

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/layout', async (req, res, next) => {
  try {
    const areas = await listAdminLayout();
    return res.json({ areas });
  } catch (error) {
    return next(error);
  }
});

router.post('/areas', async (req, res, next) => {
  try {
    const area = await createArea(req.body.areaName);
    return res.status(201).json({
      message: 'Area created successfully.',
      area
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.patch('/areas/:areaCode', async (req, res, next) => {
  try {
    const area = await updateArea(req.params.areaCode, req.body.areaName);
    return res.json({
      message: 'Area updated successfully.',
      area
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.delete('/areas/:areaCode', async (req, res, next) => {
  try {
    await deleteArea(req.params.areaCode);
    return res.json({ message: 'Area deleted successfully.' });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.post('/rooms', async (req, res, next) => {
  try {
    const room = await createRoom(req.body.roomName, req.body.areaCode);
    return res.status(201).json({
      message: 'Room created successfully.',
      room
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.patch('/rooms/:roomCode', async (req, res, next) => {
  try {
    const room = await updateRoom(req.params.roomCode, req.body.roomName, req.body.areaCode);
    return res.json({
      message: 'Room updated successfully.',
      room
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.delete('/rooms/:roomCode', async (req, res, next) => {
  try {
    await deleteRoom(req.params.roomCode);
    return res.json({ message: 'Room deleted successfully.' });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.post('/seats', async (req, res, next) => {
  try {
    const seat = await createSeat(req.body.areaCode, req.body.seatName);
    return res.status(201).json({
      message: 'Seat created successfully.',
      seat
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.patch('/seats/:seatCode', async (req, res, next) => {
  try {
    const seat = await updateSeat(req.params.seatCode, req.body);
    return res.json({
      message: 'Seat updated successfully.',
      seat
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

router.delete('/seats/:seatCode', async (req, res, next) => {
  try {
    await deleteSeat(req.params.seatCode);
    return res.json({ message: 'Seat deleted successfully.' });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
});

module.exports = router;
