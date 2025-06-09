
import express from 'express';
import {
  createProduct,
  getAllProducts,          // GET /api/products (with filters/sorting/pagination)
  getProductById,      // GET /api/products/:id
  updateProduct,       // PUT /api/products/:id
  deleteProduct,
  searchProducts,       // DELETE /api/products/:id

} from '../controllers/ProductController.js';
import upload from "../middleware/upload.js";
import multer from 'multer';
import  { authenticateUser,isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/adminroutes/create",
  authenticateUser,
  isAdmin,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific error
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Other errors like fileFilter rejection
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createProduct
);


// Get all products (with filtering, sorting, pagination)
router.get('/products', getAllProducts);

// search products
router.get("/search",searchProducts);

// Get single product by ID
router.get('/product/:id', getProductById);

// Update product
router.put('/product/:id', updateProduct);

router.delete(
  '/:id',
  authenticateUser,
  isAdmin,
  deleteProduct
);

export default router;
