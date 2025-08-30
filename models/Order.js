
// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   items: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//     },
//   ],
//   shippingAddress: {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     country: {
//       type: String,
//       required: true,
//     },
//     postalCode: {
//       type: String,
//       required: true,
//     },
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
//   paymentMethod: {
//     type: String,
//     enum: ["COD", "Online"],
//     required: true,
//   },
//   isPaid: {
//     type: Boolean,
//     default: false,
//   },
//   isDelivered: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//    status: {
//     type: String,
//     enum: ["Pending", "Processing", "Shipped", "Completed"],
//     default: "Pending",
//   },
// });

// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
// export default Order;

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  // 🔹 If order comes from quotation
  quotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },

  // 🔹 Who placed the order
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 🔹 Products included in order
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String }, // keep name snapshot at time of order
      quantity: { type: Number, required: true },
      priceAtOrder: { type: Number, required: true }, // store locked-in price
    }
  ],

  // 🔹 For normal checkout orders
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
  },

  // 🔹 Order total (for quotation orders = quotedPrice)
  total: { type: Number, required: true },

  // 🔹 Payment Info
  paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

  // 🔹 Fulfillment Status
  fulfillmentStatus: { 
    type: String, 
    enum: ["new", "processing", "shipped", "delivered", "cancelled"], 
    default: "new" 
  },
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
