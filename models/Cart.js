
// // backend/models/Cart.js (ESM)

// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const CartSchema = new Schema({
  
//   items: [
//     {
//       productId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         default: 1,
//         min: [1, 'Quantity must be at least 1'], // Optional: Add quantity validation
//       },
//     },
//   ],
// }, { timestamps: true });

// const Cart = mongoose.model('Cart', CartSchema);
// export default Cart;


// models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  mrp: Number,
  quantity: { type: Number, default: 1 },
  image: String,
  images: [String],
  cartImage: String,
  selectedImage: String,
  brand: String,
  selectedColor: String,
  size: String,
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
});

export default mongoose.model("Cart", cartSchema);
