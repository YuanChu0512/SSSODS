# Seat Occupancy Status Detection System

A web-based smart study-seat system for a student project. The current version focuses on one seat, real-time occupancy display, flexible reservation, and a clean bilingual dashboard that can later connect to an M5 C Plus device.

## Current Scope

- One seat only: `seat-001`
- Occupancy states: `Free` / `Occupied`
- Reservation window: `08:00` to `22:00`
- Reservation granularity: 15 minutes
- Maximum single reservation length: 6 hours
- Persistent storage with SQLite
- User registration and login with JWT authentication
- Privacy-aware reservation display for other users

## Tech Stack

- Backend: Node.js + Express
- Database: SQLite
- Authentication: JWT + bcryptjs
- Frontend: HTML + CSS + JavaScript

## Features

- View the current seat occupancy state
- View whether the seat is currently reserved
- Register and log in with a user account
- Reserve any valid time range between `08:00` and `22:00`
- Cancel your own reservations from the dashboard
- Display recent reservation history and occupancy events
- Keep reservation and user data after server restart
- Support bilingual Chinese/English UI switching
- Protect other users' privacy by masking reservation names
- Provide device APIs for occupancy upload and reservation polling

## Frontend Pages

- `client/index.html`: dashboard page
- `client/login.html`: login page
- `client/register.html`: register page

## Main API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Dashboard

- `GET /api/seat-status`
- `GET /api/seat-activity`
- `GET /api/reservations/slots?date=YYYY-MM-DD`
- `POST /api/reservations`
- `DELETE /api/reservations/:reservationId`

### Device

- `POST /api/device/occupancy`
- `GET /api/device/seat-status`

## Reservation Request Example

```json
{
  "reservationDate": "2026-04-07",
  "startTime": "10:00",
  "endTime": "12:00"
}
```

Rules:

- `startTime` and `endTime` must use 15-minute increments
- reservation must stay within `08:00` to `22:00`
- `endTime` must be later than `startTime`
- maximum duration is 6 hours
- overlapping reservations are rejected

## Device Integration

Upload occupancy:

```http
POST /api/device/occupancy
Content-Type: application/json
```

```json
{
  "occupancyStatus": "Occupied"
}
```

Poll reservation state:

```http
GET /api/device/seat-status
```

## Run Locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Notes

- The project currently supports a single seat for prototype and classroom demo use.
- M5 C Plus hardware is not required to run the web system locally.
- The database file `server/data/app.db` is runtime data and should not be committed.
