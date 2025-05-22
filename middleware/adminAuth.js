// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  let token;

  // Get token from header Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    req.user = decoded; // attach decoded payload to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
