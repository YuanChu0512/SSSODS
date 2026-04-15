const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config');
const { getUserById } = require('../data/userStore');

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      displayName: user.display_name || user.displayName,
      role: user.role || 'user'
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

async function requireAdmin(req, res, next) {
  try {
    const user = req.user ? await getUserById(req.user.id) : null;

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    req.user.role = user.role;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  authenticate,
  createToken,
  requireAdmin
};
