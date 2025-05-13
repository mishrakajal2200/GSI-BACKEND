// import Order from "../models/Order.js";

// export const placeOrder = async (req, res) => {
//   try {
//     const { shippingInfo, cartItems, amount, paymentMethod } = req.body;

//     const order = new Order({
//       shippingInfo,
//       cartItems,
//       amount,
//       paymentMethod,
//     });

//     await order.save();

//     res.status(201).json({ success: true, message: "Order placed successfully", order });
//   } catch (error) {
//     console.error("Order saving error:", error);
//     res.status(500).json({ success: false, message: "Failed to place order" });
//   }
// };


// export const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 }); // latest orders first
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Fetching orders error:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch orders" });
//   }
// };