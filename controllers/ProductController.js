

import mongoose from 'mongoose'; 
import Product from '../models/Product.js';

// @desc    Create a new product
// @route   POST /api/products
// export const createProduct = async (req, res) => {
//   try {
//     const newProduct = new Product(req.body);
//     const savedProduct = await newProduct.save();
//     res.status(201).json(savedProduct);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: 'Failed to create product', error: err.message });
//   }
// };


export const getAllProducts = async (req, res) => {
  try {
    const { brands, categories, sort, search } = req.query;

    const filter = {};

    // Brand filtering
    if (brands) {
      const brandArray = brands.split(',');
      filter.brand = { $in: brandArray };
    }

    // Category filtering
    if (categories) {
      const categoryArray = categories.split(',');
      filter.$or = [
        { mainCategory: { $in: categoryArray } },
        { subCategory: { $in: categoryArray } },
        { subSubCategory: { $in: categoryArray } }
      ];
    }

    // Search filtering (added here)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchFilter = {
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { mainCategory: searchRegex },
          { subCategory: searchRegex },
          { subSubCategory: searchRegex }
        ]
      };

      // Merge search filter with existing filter
      if (filter.$or) {
        // Merge both $or filters using $and
        filter.$and = [{ $or: filter.$or }, searchFilter];
        delete filter.$or;
      } else {
        Object.assign(filter, searchFilter);
      }
    }

    // Sorting
    let sortOption = {};
    if (sort === 'low') sortOption.price = 1;
    else if (sort === 'high') sortOption.price = -1;

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update product by ID

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update product', error: err.message });
  }
};

// @desc    Delete product by ID

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// searchbar
export const searchProducts = async (req, res) => {
  console.log("Received search query param:", req.query.query);

  const keyword = req.query.query;

  if (!keyword) {
    return res.status(400).json({ success: false, message: "Search query is required" });
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
        { mainCategory: { $regex: keyword, $options: "i" } },
        { subCategory: { $regex: keyword, $options: "i" } },
        { subSubCategory: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch search results" });
  }
};

// create product on admin side
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
      price,
      mrp,
      description,
    } = req.body;

    const image = req.file ? `/public/image/${req.file.filename}` : null;

    if (!name || !price || !mrp || !brand || !image) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newProduct = new Product({
      name,
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
      price,
      mrp,
      description,
      image,
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};