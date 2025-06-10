
import express from 'express';
import {
  createProduct,
  getAllProducts,          // GET /api/products (with filters/sorting/pagination)
  getProductById,      // GET /api/products/:id
  updateProduct,       // PUT /api/products/:id
  deleteProduct,
  searchProducts,       // DELETE /api/products/:id

} from '../controllers/ProductController.js';
import {upload} from "../middleware/upload.js";

import  { authenticateUser,isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create",authenticateUser,isAdmin, upload.single("image"), createProduct);

// Get all products (with filtering, sorting, pagination)
router.get('/products', getAllProducts);

// search products
router.get("/search",searchProducts);

// Get single product by ID
router.get('/product/:id', getProductById);

// ✅ Update route
router.put('/:id', authenticateUser, isAdmin, updateProduct);



router.delete(
  '/:id',
  authenticateUser,
  isAdmin,
  deleteProduct
);

export default router;
