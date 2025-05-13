import Product from "../models/CosmosProduct.js";

export const getcosmosproduct = async (req, res) => {
  try {
    // Fetch all products without category filter
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
