// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   shippingInfo: {
//     fullName: String,
//     phone: String,
//     address: String,
//     city: String,
//     country: String,
//     state: String,
//     zip: String,
//   },
//   cartItems: [
//     {
//       productId: String,
//       name: String,
//       price: Number,
//       quantity: Number,
//     },
//   ],
//   amount: Number,
//   paymentMethod: {
//     type: String,
//     enum: ["COD", "Online"],
//     default: "COD",
//   },
//   status: {
//     type: String,
//     default: "Pending",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Prevent OverwriteModelError
// export default mongoose.models.Order || mongoose.model("Order", orderSchema);



// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   total: { type: Number, required: true },
//   paymentMethod: { type: String, enum: ["Online", "COD"], required: true },
//   shippingInfo: {
//     name: String,
//     address: String,
//     city: String,
//     state: String,
//     postalCode: String,
//     phone: String,
//   },
//   items: [
//     {
//       productId: String,
//       name: String,
//       quantity: Number,
//       price: Number,
//     },
//   ],
//   status: { type: String, default: "Processing" },
// }, { timestamps: true });

// // ✅ Avoid OverwriteModelError in development
// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
// export default Order;





import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;

