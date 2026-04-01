const express = require('express');
const path = require('path');

const { initializeDatabase } = require('./db');
const authRouter = require('./routes/auth');
const seatRouter = require('./routes/seat');

const app = express();
const PORT = process.env.PORT || 3000;
const clientPath = path.join(__dirname, '..', 'client');

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api', seatRouter);
app.use(express.static(clientPath));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Seat monitor server is running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
