import Product from "../models/AmericanProducts.js";

export const getAmericanProducts = async (req, res) => {
  try {
    const products = await Product.find({
      category: { $in: ["AT", "Kamiliant", "Accessries"] },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
