// routes/adminRoutes.js
import express from 'express';
import { adminLogin,getAdminStats } from '../controllers/adminController.js';
import {authenticateUser,isAdmin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/admin/login', adminLogin);

router.get('/admin/stats', authenticateUser, isAdmin, getAdminStats);



export default router;
