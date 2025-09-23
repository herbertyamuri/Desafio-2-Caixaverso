const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super_secret_key_for_dev_only';


function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET);
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = {
  authMiddleware,
  signToken,
};
