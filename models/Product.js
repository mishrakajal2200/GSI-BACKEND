
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  brand: {
    type: String,
    required: true,
    enum: [
      "VIP",
      "American Tourister",
      "Safari",
      "Timus",
      "Cosmos",
      "Harrisons",
      "Prestige",
      "GSI Enterprises"
    ]
  },

  mainCategory: {
    type: String,
    required: true,
    trim: true,
  },

  subCategory: {
    type: String,
    trim: true,
  },

  subSubCategory: {
    type: String,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String, // URL or base64
    default: '',
  },

  description: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
