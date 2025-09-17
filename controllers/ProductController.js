

import mongoose from 'mongoose'; 
import Product from '../models/Product.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module workaround to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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


// export const getAllProducts = async (req, res) => {
//   try {
//     const { brands, categories, sort, search } = req.query;

//     const filter = {};

//     // Brand filtering
//     if (brands) {
//       const brandArray = brands.split(',');
//       filter.brand = { $in: brandArray };
//     }

//     // Category filtering
//     if (categories) {
//       const categoryArray = categories.split(',');
//       filter.$or = [
//         { mainCategory: { $in: categoryArray } },
//         { subCategory: { $in: categoryArray } },
//         { subSubCategory: { $in: categoryArray } }
//       ];
//     }

//     // Search filtering (added here)
//     if (search) {
//       const searchRegex = new RegExp(search, 'i');
//       const searchFilter = {
//         $or: [
//           { name: searchRegex },
//           { brand: searchRegex },
//           { mainCategory: searchRegex },
//           { subCategory: searchRegex },
//           { subSubCategory: searchRegex }
//         ]
//       };

//       // Merge search filter with existing filter
//       if (filter.$or) {
//         // Merge both $or filters using $and
//         filter.$and = [{ $or: filter.$or }, searchFilter];
//         delete filter.$or;
//       } else {
//         Object.assign(filter, searchFilter);
//       }
//     }

//     // Sorting
//     let sortOption = {};
//     if (sort === 'low') sortOption.price = 1;
//     else if (sort === 'high') sortOption.price = -1;

//     const products = await Product.find(filter).sort(sortOption);

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };
export const getAllProducts = async (req, res) => {
  try {
    const { brands, categories, sort, search } = req.query;

    const filter = {};

    // Brand filtering
    if (brands) {
      const brandArray = brands.split(",");
      filter.brand = { $in: brandArray };
    }

    // Category filtering
    if (categories) {
      const categoryArray = categories.split(",");
      filter.$or = [
        { mainCategory: { $in: categoryArray } },
        { subCategory: { $in: categoryArray } },
        { subSubCategory: { $in: categoryArray } },
      ];
    }

    // Search filtering
    if (search) {
      const searchRegex = new RegExp(search, "i");
      const searchFilter = {
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { mainCategory: searchRegex },
          { subCategory: searchRegex },
          { subSubCategory: searchRegex },
        ],
      };

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, searchFilter];
        delete filter.$or;
      } else {
        Object.assign(filter, searchFilter);
      }
    }

    // Sorting
    let sortOption = {};
    if (sort === "low") sortOption.price = 1;
    else if (sort === "high") sortOption.price = -1;

    const products = await Product.find(filter).sort(sortOption);

    // ✅ Normalize image URLs
    const host = `${req.protocol}://${req.get("host")}`;

    const normalizeImage = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;

  // ✅ if stored as "image/american-red.avif"
  if (img.startsWith("image/")) return `${host}/${img}`;

  // ✅ if stored in /uploads
  if (img.startsWith("uploads/")) return `${host}/${img}`;
  if (img.startsWith("/uploads/")) return `${host}${img}`;

  // fallback
  return `${host}/uploads/${img}`;
};


    const productsWithFullUrl = products.map((p) => ({
      ...p._doc,
      image: normalizeImage(p.image), // ✅ always main image full URL
      images: p.images ? p.images.map(normalizeImage) : [],
    }));

    res.status(200).json(productsWithFullUrl);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error });
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

// add product from frontend
// export const createProduct = async (req, res) => {
//   try {
//     console.log("🧾 Incoming form data:", req.body);
//     console.log("🖼️ Uploaded file:", req.file);

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

//     if (!name || !brand || !price || !mrp || !req.file) {
//       return res.status(400).json({
//         error: "Please provide name, brand, price, MRP, and an image file",
//       });
//     }

//     const product = new Product({
//       name,
//       brand,
//       mainCategory: mainCategory || "",
//       subCategory: subCategory || "",
//       subSubCategory: subSubCategory || "",
//       price,
//       mrp,
//       description: description || "",
//       image: `/uploads/${req.file.filename}`,
//     });

//     const savedProduct = await product.save();

//     res.status(201).json({
//       message: "✅ Product created successfully",
//       product: savedProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error in createProduct:", error);
//     res.status(500).json({ error: error.message || "Server error" });
//   }
// };



// export const createProduct = async (req, res) => {
//   try {
//     console.log("🧾 Incoming form data:", req.body);
//     console.log("🖼️ Uploaded files:", req.files); // multiple images

//     const {
//       name,
//       brand,
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       description,
//       mrp,
//       variants, // this is expected to be JSON string
//     } = req.body;

//     if (!name || !brand || !mrp || !variants) {
//       return res.status(400).json({
//         error: "Please provide name, brand, MRP, and variants",
//       });
//     }

//     // Parse variants from JSON string to object
//     let parsedVariants;
//     try {
//       parsedVariants = JSON.parse(variants);
//     } catch (error) {
//       return res.status(400).json({ error: "Invalid variants JSON" });
//     }

//     // Attach uploaded image paths to each variant
//     if (req.files && req.files.length > 0) {
//       let fileIndex = 0;
//       parsedVariants = parsedVariants.map((variant) => {
//         const imageCount = variant.imageCount || 1;
//         const images = [];

//         for (let i = 0; i < imageCount && fileIndex < req.files.length; i++) {
//           images.push(`/uploads/${req.files[fileIndex].filename}`);
//           fileIndex++;
//         }

//         return {
//           ...variant,
//           images,
//         };
//       });
//     }

//     const product = new Product({
//       name,
//       brand,
//       mainCategory: mainCategory || "",
//       subCategory: subCategory || "",
//       subSubCategory: subSubCategory || "",
//       description: description || "",
//       mrp,
//       variants: parsedVariants,
//     });

//     const savedProduct = await product.save();

//     res.status(201).json({
//       message: "✅ Product created successfully",
//       product: savedProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error in createProduct:", error);
//     res.status(500).json({ error: error.message || "Server error" });
//   }
// };
// export const createProduct = async (req, res) => {
//   try {
//     console.log("🧾 Incoming form data:", req.body);
//     console.log("🖼️ Uploaded files:", req.files);

//     const {
//       name,
//       brand,
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       description,
//       mrp,
//       price
//     } = req.body;

//     if (!name || !brand || !mrp || !price) {
//       return res.status(400).json({
//         error: "Please provide name, brand, MRP, and price",
//       });
//     }

//     // Handle main image
//     let mainImage = "";
//     if (req.files['image'] && req.files['image'][0]) {
//       mainImage = `/uploads/${req.files['image'][0].filename}`;
//     }

//     // Handle additional images
//     let additionalImages = [];
//     if (req.files['images']) {
//       additionalImages = req.files['images'].map((file) => `/uploads/${file.filename}`);
//     }

//     const product = new Product({
//       name,
//       brand,
//       mainCategory: mainCategory || "",
//       subCategory: subCategory || "",
//       subSubCategory: subSubCategory || "",
//       description: description || "",
//       mrp,
//       price,
//       mainImage,
//       additionalImages,
//     });

//     const savedProduct = await product.save();

//     res.status(201).json({
//       message: "✅ Product created successfully",
//       product: savedProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error in createProduct:", error);
//     res.status(500).json({ error: error.message || "Server error" });
//   }
// };

export const createProduct = async (req, res) => {
  try {
    console.log("🧾 Incoming form data:", req.body);
    console.log("🖼️ Uploaded files:", req.files);

    const {
      name,
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
      description,
      mrp,
      price,
    } = req.body;

    if (!name || !brand || !mrp || !price) {
      return res.status(400).json({
        error: "Please provide name, brand, MRP, and price",
      });
    }

    // Handle main image
    let image = "";
    if (req.files["image"] && req.files["image"][0]) {
      image = `${req.protocol}://${req.get("host")}/uploads/${req.files["image"][0].filename}`;
    }

    // Handle additional images
    let images = [];
    if (req.files["images"]) {
      images = req.files["images"].map(
        (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );
    }

    const product = new Product({
      name,
      brand,
      mainCategory: mainCategory || "",
      subCategory: subCategory || "",
      subSubCategory: subSubCategory || "",
      description: description || "",
      mrp,
      price,
      image,   // ✅ single main image
      images,  // ✅ array of images
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



export const generateQuotation = async (req, res) => {
  try {
    const product = req.body; // Expect name, brand, price, etc.

    const doc = new PDFDocument();
    const fileName = `Quotation-${Date.now()}.pdf`;
    const quotationsDir = path.join(__dirname, '../quotations');

    // Make sure quotations folder exists
    if (!fs.existsSync(quotationsDir)) {
      fs.mkdirSync(quotationsDir);
    }

    const filePath = path.join(quotationsDir, fileName);
    doc.pipe(fs.createWriteStream(filePath));

    // --- PDF Content ---
    doc.fontSize(20).text('🧾 Product Quotation', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Product: ${product.name}`);
    doc.text(`Brand: ${product.brand}`);
    doc.text(`Category: ${product.mainCategory} / ${product.subCategory}`);
    doc.text(`Price: ₹${product.price}`);
    doc.text(`Description: ${product.description}`);
    
    doc.moveDown();
    doc.fontSize(14).text('🏦 Bank Details:');
    doc.fontSize(12).text(`Account Name: GSI Enterprises`);
    doc.text(`Account Number: 123456789012`);
    doc.text(`IFSC: SBIN0001234`);
    doc.text(`Bank: State Bank of India`);

    doc.end();

    doc.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('❌ Download error:', err);
          res.status(500).json({ error: 'Download failed' });
        } else {
          fs.unlinkSync(filePath); // Optional: Delete after download
        }
      });
    });
  } catch (error) {
    console.error('❌ Error generating quotation:', error);
    res.status(500).json({ error: error.message });
  }
};

// export workiing on admin 
export const exportProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Brand', key: 'brand', width: 20 },
      { header: 'Main Category', key: 'mainCategory', width: 20 },
      { header: 'Sub Category', key: 'subCategory', width: 20 },
      { header: 'Sub Sub Category', key: 'subSubCategory', width: 20 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'MRP', key: 'mrp', width: 10 },
      { header: 'Description', key: 'description', width: 30 }
    ];

    products.forEach((product) => {
      worksheet.addRow(product);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export products' });
  }
};

// import working on admin
// export const importProducts = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(req.file.buffer);

//     const worksheet = workbook.worksheets[0];
//     const products = [];

//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber === 1) return; // skip headers

//       const [
//         name,
//         brand,
//         mainCategory,
//         subCategory,
//         subSubCategory,
//         price,
//         mrp,
//         description
//       ] = row.values.slice(1); // slice to remove Excel internal ID

//       products.push({
//         name,
//         brand,
//         mainCategory,
//         subCategory,
//         subSubCategory,
//         price,
//         mrp,
//         description
//       });
//     });

//     await Product.insertMany(products);
//     res.status(200).json({
//       message: 'Products imported successfully',
//       count: products.length
//     });
//   } catch (error) {
//     console.error('Import error:', error.message);
//     res.status(500).json({ error: 'Failed to import products' });
//   }
// };



import RecentActivity from "../models/RecentActivity.js"; // 👈 import this

export const importProducts = async (req, res) => {
  try {
    console.log("File received:", req.file ? req.file.originalname : "❌ none");

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or wrong file type" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return res
        .status(400)
        .json({ error: "No worksheet found in Excel file" });
    }

    const products = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip headers

      const [
        name,
        brand,
        mainCategory,
        subCategory,
        subSubCategory,
        price,
        mrp,
        description,
      ] = row.values.slice(1);

      products.push({
        name,
        brand,
        mainCategory,
        subCategory,
        subSubCategory,
        price,
        mrp,
        description,
      });
    });

    await Product.insertMany(products);

    // ✅ Log the activity
    await RecentActivity.create({
      description: `Imported ${products.length} products`,
      user: req.user._id, // comes from authenticateUser middleware
    });

    res.status(200).json({
      message: "Products imported successfully",
      count: products.length,
    });
  } catch (error) {
    console.error("Import error:", error.stack || error);
    res
      .status(500)
      .json({ error: error.message || "Failed to import products" });
  }
};






