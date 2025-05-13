import express from 'express';
import { getAllShops } from '../controllers/shopController.js';

const router = express.Router();

// Define routes
router.get('/shops', getAllShops);

// Export the router as the default export
export default router;
