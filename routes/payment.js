
import express from "express";
import { placeCODOrder,getOrders,createRazorpayOrder,getOrdersCount,getAllOrders  } from "../controllers/paymentController.js";
import authenticateUser from "../middleware/authMiddleware.js";


const router = express.Router();

// Create Razorpay order
router.post('/create-order',authenticateUser,createRazorpayOrder);

// COD route
router.post("/place-order",authenticateUser, placeCODOrder);

router.get("/get-orders",authenticateUser,getOrders);

const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

router.get('/all-orders', authenticateUser,adminOnly, getAllOrders);

// new count route (admin only)
router.get('/count', authenticateUser,adminOnly, getOrdersCount);

export default router;
