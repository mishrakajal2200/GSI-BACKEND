
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

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  images: [String],
  price: Number,
  stock: Number,
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  mainCategory: String,
  subCategory: String,
  subSubCategory: String,
  description: String,
  variants: [variantSchema], // 👈 Add all color/size/image options here
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
