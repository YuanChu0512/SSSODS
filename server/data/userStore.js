const bcrypt = require('bcryptjs');

const { run, get } = require('../db');

async function createUser({ username, displayName, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  const result = await run(
    `INSERT INTO users (username, display_name, password_hash, created_at)
     VALUES (?, ?, ?, ?)`,
    [username, displayName, passwordHash, now]
  );

  return getUserById(result.lastID);
}

function getUserById(id) {
  return get(
    `SELECT id, username, display_name, created_at FROM users WHERE id = ?`,
    [id]
  );
}

function getUserByUsername(username) {
  return get(`SELECT * FROM users WHERE username = ?`, [username]);
}

async function verifyUserCredentials(username, password) {
  const user = await getUserByUsername(username);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    created_at: user.created_at
  };
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  verifyUserCredentials
};
