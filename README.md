# Seat Occupancy Status Detection System

A web-based seat occupancy and reservation system with:

- persistent SQLite storage
- user registration and login
- seat reservation management
- occupancy status updates from an M5 C Plus device
- bilingual Chinese/English frontend

## Tech Stack

- Backend: Node.js + Express
- Database: SQLite
- Auth: JWT + bcryptjs
- Frontend: HTML + CSS + JavaScript

## Features

- View current seat occupancy and reservation status
- Register and log in with a user account
- Reserve or cancel a seat after login
- Record reservation history and occupancy events
- Provide device APIs for occupancy uploads and reservation polling

## Main API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/seat-status`
- `GET /api/seat-activity`
- `POST /api/device/occupancy`
- `GET /api/device/seat-status`
- `POST /api/reservations`
- `DELETE /api/reservations/current`

## Run Locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```
