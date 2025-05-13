import Product from "../models/VipProduct.js";

export const getVipProducts = async (req, res) => {
  try {
    const products = await Product.find({
      category: { $in: ["Carlton", "Accessories", "Skybag"] },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
