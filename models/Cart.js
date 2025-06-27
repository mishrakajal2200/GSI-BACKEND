
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


// backend/models/Cart.js (ESM)

import mongoose from 'mongoose';
const { Schema } = mongoose;

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: [1, 'Quantity must be at least 1'],
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      image: {
        type: String, // Or use [String] if storing multiple
        required: true,
      },
    },
  ],
}, { timestamps: true });

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
