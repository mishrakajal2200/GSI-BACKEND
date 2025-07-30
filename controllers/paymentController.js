import dotenv from 'dotenv';
dotenv.config();
import Razorpay from "razorpay";
import Order from '../models/Order.js'
// controllers/paymentController.js

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders }); // ✅ Return as object
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// for admin only 
export const getOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({});
    res.status(200).json({ count });
  } catch (err) {
    console.error('Failed to get orders count', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// 🆕 Get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Failed to fetch all orders", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// controllers/paymentController.js
// export const placeCODOrder = async (req, res) => {
//   try {
//     const { items, shippingAddress, totalPrice, paymentMethod } = req.body;

//     // 1) Basic presence check
//     if (!items || !shippingAddress || !totalPrice || !paymentMethod) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing one or more required fields." });
//     }

//     // 2) Destructure the exact fields you're sending
//     const { fullName, phone, address, city, country, postalCode } = shippingAddress;

//     // 3) Log for debugging
//     console.log("👉 Received shippingAddress:", shippingAddress);

//     // 4) Field validation
//     if (!fullName?.trim()) {
//       return res.status(400).json({ success: false, message: "Full name is required." });
//     }

//     const phoneRegex = /^[\d\-\+\(\)\s]{10,15}$/;
//     if (!phone || !phoneRegex.test(phone)) {
//       return res.status(400).json({ success: false, message: "Invalid phone number." });
//     }

//     if (!address?.trim()) {
//       return res.status(400).json({ success: false, message: "Address is required." });
//     }
//     if (!city?.trim()) {
//       return res.status(400).json({ success: false, message: "City is required." });
//     }
//     if (!country?.trim()) {
//       return res.status(400).json({ success: false, message: "Country is required." });
//     }

//     // 5) PIN code validation (exactly 6 digits)
//     const pinRegex = /^[0-9]{6}$/;
//     if (!postalCode || !pinRegex.test(postalCode)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid postal code. Must be 6 digits." });
//     }

//     // 6) Create & save the order
//     const newOrder = new Order({
//       user: req.user._id,
//       items,
//       shippingAddress: {
//         fullName,
//         phone,
//         address,
//         city,
//         country,
//         postalCode,
//       },
//       totalPrice,
//       paymentMethod,
//       isPaid: false,   // COD: payment happens on delivery
//     });

//     const savedOrder = await newOrder.save();
//     return res.status(201).json({ success: true, order: savedOrder });

//   } catch (error) {
//     console.error("Error placing COD order:", error);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
export const placeCODOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice, paymentMethod } = req.body;

    // 1) Basic presence check
    if (!items || !shippingAddress || !totalPrice || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing one or more required fields.",
      });
    }

    // 2) Destructure shipping fields
    const { fullName, phone, address, city, country, postalCode } =
      shippingAddress;

    // 3) Log for debugging
    console.log("👉 Received shippingAddress:", shippingAddress);

    // 4) Field validation
    if (!fullName?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Full name is required." });
    }

    const phoneRegex = /^[\d\-\+\(\)\s]{10,15}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number." });
    }

    if (!address?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required." });
    }
    if (!city?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "City is required." });
    }
    if (!country?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Country is required." });
    }

    const pinRegex = /^[0-9]{6}$/;
    if (!postalCode || !pinRegex.test(postalCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid postal code. Must be 6 digits.",
      });
    }

    // ✅ Map items correctly according to schema
    const formattedItems = items.map((item) => ({
      productId: item.product._id || item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      user: req.user._id,
      items: formattedItems,
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        country,
        postalCode,
      },
      totalPrice,
      paymentMethod,
      isPaid: false,
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Error placing COD order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required." });
    }

    const orderOptions = {
      amount: amount, // paise
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 1,
    };

    razorpay.orders.create(orderOptions, (error, order) => {
      if (error) {
        console.error("Razorpay order creation error:", error);
        return res.status(500).json({ message: "Error creating order", error: error.message });
      }

      res.status(200).json({
        key: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    });
  } catch (error) {
    console.error("Server error in createRazorpayOrder:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
