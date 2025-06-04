import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  saveForLater,
  applyCoupon,
} from '../controllers/cartController.js';

import  {authenticateUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getcart', authenticateUser, getCart);
router.post('/add', authenticateUser, addToCart);
router.patch('/increase/:productId', authenticateUser, increaseQuantity);
router.patch('/decrease/:productId', authenticateUser, decreaseQuantity);
router.delete('/remove/:productId', authenticateUser, removeFromCart);
router.delete('/clear', authenticateUser, clearCart);
router.patch('/save/:productId', authenticateUser, saveForLater);
router.post('/apply-coupon', authenticateUser, applyCoupon);


export default router;
