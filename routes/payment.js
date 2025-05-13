// // routes/payment.js
// const express = require("express");
// const Razorpay = require("razorpay");
// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: "rzp_live_BDUssa14rRnrJV",
//   key_secret: "GXH9T6pFRpa08lN0luP5VnuQ",
// });

// router.post("/create-order", async (req, res) => {
//   const { amount } = req.body;
//   const options = {
//     amount: amount * 100, // Amount in paise
//     currency: "INR",
//     receipt: `receipt_order_${Date.now()}`,
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create order" });
//   }
// });



// module.exports = router;




import express from "express";
import { placeCODOrder,getOrders,createRazorpayOrder  } from "../controllers/paymentController.js";
import authenticateUser from "../middleware/authMiddleware.js";


const router = express.Router();

// Create Razorpay order
router.post('/create-order',authenticateUser,createRazorpayOrder)

// COD route
router.post("/place-order",authenticateUser, placeCODOrder);

router.get("/get-orders",authenticateUser,getOrders)
export default router;
