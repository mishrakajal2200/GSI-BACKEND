import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["AT", "Kamiliant", "Accessries"], // optional validation
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("AmericanProduct", productSchema);

export default Product;
