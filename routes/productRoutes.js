
import express from 'express';
import {
  createProduct,
  getAllProducts,          // GET /api/products (with filters/sorting/pagination)
  getProductById,      // GET /api/products/:id
  updateProduct,       // PUT /api/products/:id
  deleteProduct,
  searchProducts, 
  exportProducts,
  importProducts,
  generateQuotation     

} from '../controllers/ProductController.js';

import { multiUpload } from "../middleware/upload.js";

import  { authenticateUser,isAdmin } from "../middleware/authMiddleware.js";
import {uploadCsv} from '../middleware/uploadCsv.js';
const router = express.Router();


// router.post("/adminroutes/create",authenticateUser,isAdmin, upload.array("image",4), createProduct);
router.post(
  "/adminroutes/create",
  authenticateUser,
  isAdmin,
  multiUpload,
  createProduct
);

// Get all products (with filtering, sorting, pagination)
router.get('/products', getAllProducts);

// search products
router.get("/search",searchProducts);

// Get single product by ID
router.get('/product/:id', getProductById);

// ✅ Update route
router.put('/:id', authenticateUser, isAdmin, updateProduct);

// export admin routes
router.get('/adminroutes/export', authenticateUser, isAdmin, exportProducts);

// import admin route 
router.post('/adminroutes/import', authenticateUser, isAdmin, uploadCsv.single('file'), importProducts);

router.delete(
  '/:id',
  authenticateUser,
  isAdmin,
  deleteProduct
);



export default router;
