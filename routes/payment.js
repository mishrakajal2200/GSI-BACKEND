
import express from "express";
import { placeCODOrder,getOrders,createRazorpayOrder,getOrdersCount,getAllOrders  } from "../controllers/paymentController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import {isAdmin} from '../middleware/adminAuth.js'

const router = express.Router();

// Create Razorpay order
router.post('/create-order',authenticateUser,createRazorpayOrder);

// COD route
router.post("/place-order",authenticateUser, placeCODOrder);

router.get("/get-orders",authenticateUser,getOrders);

router.get('/all-orders', authenticateUser, getAllOrders);

// new count route (admin only)
router.get('/count', authenticateUser, getOrdersCount);

export default router;
