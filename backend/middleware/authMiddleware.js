import jwt from 'jsonwebtoken';
import { get } from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'You are not logged in! Please log in to get access.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_vinays_heaven_123');

    const currentUser = await get('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
    if (!currentUser) {
      return res.status(401).json({ status: 'error', message: 'The user belonging to this token does no longer exist.' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'You do not have permission to perform this action' });
    }
    next();
  };
};
