import Product from "../models/Product.js"; // Import Product model
import Brand from "../models/Brand.js"; // Import Brand model (optional if you want to fetch available brands)
import Category from "../models/Category.js"; // Import Category model (optional if you want to fetch available categories)

// Controller function to fetch products based on filters
export const getFilteredProducts = async (req, res) => {
  const { brand, category, subCategory, priceRange } = req.query; // Get filters from query parameters

  let filter = {};

  // Add filter for brand
  if (brand) {
    filter.brand = brand;
  }

  // Add filter for category (mainCategory)
  if (category) {
    filter.mainCategory = category;
  }

  // Add filter for subCategory (if needed)
  if (subCategory) {
    filter.subCategory = subCategory;
  }

  // Add filter for price range (min and max price)
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-');
    filter.price = {
      $gte: minPrice || 0, // Price greater than or equal to minPrice
      $lte: maxPrice || Number.MAX_VALUE, // Price less than or equal to maxPrice
    };
  }

  try {
    // Fetch products based on filter criteria
    const products = await Product.find(filter);
    res.status(200).json(products); // Send back the filtered products
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: "Error fetching filtered products" });
  }
};

// Controller function to fetch available brands (optional)
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find(); // Fetch all brands from the database
    res.status(200).json(brands); // Send back as response
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Error fetching brands" });
  }
};

// Controller function to fetch available categories (optional)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from the database
    res.status(200).json(categories); // Send back as response
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};
