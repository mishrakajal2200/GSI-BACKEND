
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      console.log('Token received:', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Support both userId or id in payload
      const userId = decoded.userId || decoded.id;

      if (!userId) {
        return res.status(401).json({ message: 'Invalid token structure' });
      }

      req.user = await User.findById(userId).select('-password');
      console.log('User found:', req.user);

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.name, error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please log in again.' });
      }
      res.status(401).json({ message: 'Not authorized, token invalid.' });
    }
  } else {
    console.log('No token received');
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied, admin only' });
};

export default authenticateUser;
