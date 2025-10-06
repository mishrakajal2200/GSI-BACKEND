
import express from "express";
import { placeCODOrder,getOrders,createRazorpayOrder,getOrdersCount,getAllOrders  } from "../controllers/paymentController.js";
import authenticateUser, { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Razorpay order
router.post('/create-order',createRazorpayOrder);

// COD route
router.post("/place-order",authenticateUser, placeCODOrder);

router.get("/get-orders",authenticateUser,getOrders);

router.get('/all-orders', authenticateUser,isAdmin, getAllOrders);

// new count route (admin only)
router.get('/count', authenticateUser,isAdmin, getOrdersCount);

export default router;
