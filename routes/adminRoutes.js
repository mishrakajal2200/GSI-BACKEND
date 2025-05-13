// routes/adminRoutes.js
import express from 'express';
import {adminLogin, getAdminStats } from '../controllers/adminController.js';
import {authenticateUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


// Admin login route
router.post('/loginroutes', adminLogin);

router.get('/stats', authenticateUser, isAdmin, getAdminStats);

export default router;
