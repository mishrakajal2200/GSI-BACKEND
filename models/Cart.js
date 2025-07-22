
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


import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
