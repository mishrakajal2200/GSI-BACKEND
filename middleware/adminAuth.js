// // middleware/authMiddleware.js
// import jwt from 'jsonwebtoken';

// export const adminAuth = (req, res, next) => {
//   let token;

//   // Get token from header Authorization: Bearer <token>
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized as admin' });
//     }

//     req.user = decoded; // attach decoded payload to request
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Token invalid or expired' });
//   }
// };

// export const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Access denied. Admins only.' });
//   }
// };


// import express from 'express';
// import { adminLogin, getAdminStats } from '../controllers/adminController.js';
// import { adminAuth, isAdmin } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/login', adminLogin);

// // Protect route: only logged-in admins can access
// router.get('/admin/stats', adminAuth, isAdmin, getAdminStats);

// export default router;