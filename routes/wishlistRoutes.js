

import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} from '../controllers/wishlistController.js';

import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getwishlist', authenticateUser, getWishlist);
router.post('/add', authenticateUser, addToWishlist);
router.delete('/remove/:productId', authenticateUser, removeFromWishlist);
router.patch('/move/:productId', authenticateUser, moveToCart);

export default router;