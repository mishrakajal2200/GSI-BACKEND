
import express from "express";
import { placeCODOrder,getOrders,createRazorpayOrder  } from "../controllers/paymentController.js";
import authenticateUser from "../middleware/authMiddleware.js";


const router = express.Router();

// Create Razorpay order
router.post('/create-order',authenticateUser,createRazorpayOrder);

// COD route
router.post("/place-order",authenticateUser, placeCODOrder);

router.get("/get-orders",authenticateUser,getOrders)
export default router;
