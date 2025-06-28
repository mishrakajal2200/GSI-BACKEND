
// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   brand: {
//     type: String,
//     required: true,
//     enum: [
//       "VIP",
//       "American Tourister",
//       "Safari",
//       "Timus",
//       "Cosmos",
//       "Harrisons",
//       "Prestige",
//       "GSI Enterprises"
//     ]
//   },

//   mainCategory: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   subCategory: {
//     type: String,
//     trim: true,
//   },

//   subSubCategory: {
//     type: String,
//     trim: true,
//   },

//   price: {
//     type: Number,
//     required: true,
//   },

//   image: {
//     type: String, // URL or base64
//     default: '',
//   },

//   description: {
//     type: String,
//     trim: true,
//   },

// }, { timestamps: true });

// const Product = mongoose.model('Product', productSchema);
// export default Product;





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

  mrp: {
    type: Number,
    required: true
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

  
  // 👇 Multiple images: front, side, back
  images: {
    front: { type: String, default: '' },
    side: { type: String, default: '' },
    back: { type: String, default: '' },
  },

  // 👇 Description
  description: {
    type: String,
    trim: true,
  },

  // 👇 Available colors
  colors: [
    {
      type: String,
      trim: true,
    }
  ],

  // 👇 Available sizes (if needed)
  sizes: [
    {
      type: String,
      trim: true,
    }
  ],

  // 👇 Optional: In-stock status by variant
  inStock: {
    type: Boolean,
    default: true,
  },

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
