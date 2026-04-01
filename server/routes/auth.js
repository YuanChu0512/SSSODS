const express = require('express');

const { createUser, getUserById, getUserByUsername, verifyUserCredentials } = require('../data/userStore');
const { authenticate, createToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '').trim();
    const displayName = String(req.body.displayName || username).trim();

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const user = await createUser({ username, displayName, password });
    const token = createToken(user);

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '').trim();
    const user = await verifyUserCredentials(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = createToken(user);

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
