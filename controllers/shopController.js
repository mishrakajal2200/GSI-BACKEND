import Shop from "../models/shopModel.js"; // Use import instead of require

export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
