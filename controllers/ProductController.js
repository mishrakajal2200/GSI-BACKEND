

import mongoose from 'mongoose'; 
import Product from '../models/Product.js';
import { Parser } from 'json2csv';
import csv from 'csv-parser';
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
    console.error('Delete error:', err);
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
// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       brand,
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       price,
//       mrp,
//       description,
//     } = req.body;

//     const imageUrl = req.file ? req.file.path : '';


//     if (!name || !price || !mrp || !brand || !image) {
//       return res.status(400).json({ message: 'All required fields must be filled' });
//     }

//     const newProduct = new Product({
//       name,
//       brand,
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       price,
//       mrp,
//       description,
//       image:imageUrl,
//     });

//     await newProduct.save();

//     res.status(201).json({ message: 'Product created successfully', product: newProduct });
//   } catch (err) {
//     console.error('Error creating product:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       brand,
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       price,
//       mrp,
//       description,
//     } = req.body;

//     // Check required fields
//     if (!name || !brand || !price || !mrp || !req.file) {
//       return res.status(400).json({ error: "All required fields must be provided" });
//     }

//     const product = new Product({
//       name,
//       brand,
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       price,
//       mrp,
//       description,
//       image: req.file.filename, // Save image file name
//     });

//     await product.save();

//     res.status(201).json({ message: "Product created successfully", product });
//   } catch (error) {
//     console.error("Error in createProduct:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };



// add product from frontend
export const createProduct = async (req, res) => {
  try {
    console.log("🧾 Incoming form data:", req.body);
    console.log("🖼️ Uploaded file:", req.file);

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

    if (!name || !brand || !price || !mrp || !req.file) {
      return res.status(400).json({
        error: "Please provide name, brand, price, MRP, and an image file",
      });
    }

    const product = new Product({
      name,
      brand,
      mainCategory: mainCategory || "",
      subCategory: subCategory || "",
      subSubCategory: subSubCategory || "",
      price,
      mrp,
      description: description || "",
      image: `/uploads/${req.file.filename}`,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "✅ Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("❌ Error in createProduct:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// export workiing on admin 
export const exportProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const fields = ['name', 'brand', 'mainCategory', 'subCategory', 'subSubCategory', 'price', 'mrp', 'description'];
    const parser = new Parser({ fields });
    const csv = parser.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export products' });
  }
};

// import working on admin
export const importProducts = async (req, res) => {
  try {
    const results = [];
    const stream = require('streamifier').createReadStream(req.file.buffer);

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        await Product.insertMany(results);
        res.status(200).json({ message: 'Products imported successfully', count: results.length });
      });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import products' });
  }
};




