
import express from 'express';
import {
  createProduct,
  getAllProducts,          // GET /api/products (with filters/sorting/pagination)
  getProductById,      // GET /api/products/:id
  updateProduct,       // PUT /api/products/:id
  deleteProduct,
  searchProducts,       // DELETE /api/products/:id
 
} from '../controllers/ProductController.js';

const router = express.Router();

// Create a product
router.post('/', createProduct);

// Get all products (with filtering, sorting, pagination)
router.get('/products', getAllProducts);

// Get single product by ID
router.get('/:id', getProductById);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

router.get("/search",searchProducts)

export default router;
