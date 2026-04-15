const buildingLayout = [
  {
    buildingCode: 'area-1',
    buildingName: 'Area 1',
    rooms: [
      { roomCode: 'room-a', roomName: 'Main Study Room' },
      { roomCode: 'room-b', roomName: 'Quiet Study Room' }
    ],
    seats: [
      { seatCode: 'seat-001', seatName: 'Seat A1', positionOrder: 1 },
      { seatCode: 'seat-002', seatName: 'Seat A2', positionOrder: 2 },
      { seatCode: 'seat-101', seatName: 'Seat B1', positionOrder: 3 },
      { seatCode: 'seat-102', seatName: 'Seat B2', positionOrder: 4 }
    ]
  }
];

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'seat-monitor-development-secret',
  primarySeatCode: buildingLayout[0].seats[0].seatCode,
  buildingLayout
};
