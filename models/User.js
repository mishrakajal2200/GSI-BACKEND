
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer', // By default, users are customers
    },
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    }],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    cart: [
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    color: String,
    size: String,
  }
],
    address: { type: String },  // Optional, will be updated at checkout
    phone: { type: String },  // Optional, will be updated at checkout
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update cart and other methods...
const User = mongoose.model('User', userSchema);
export default User;

