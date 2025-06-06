
import express from 'express';
import {
  loginUser,
  registerUser,
  searchProducts,
  getUserProfile,
  updateUserProfile,
  updateCheckoutDetails,
  getAllUsers,
  updateUserRole,
  updateUserDetails,
  deleteUser,
  blockUnblockUser,
  getUserById,
} from '../controllers/userController.js';



import authenticateUser, { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/signup', registerUser);
router.post('/login', loginUser);


// Search
router.get("/search", searchProducts);

// User profile routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);

// Checkout route
router.put('/checkout', authenticateUser, updateCheckoutDetails);



// 👇 Admin User Management Routes

// Get all users (Admin only)
router.get('/', authenticateUser,isAdmin, getAllUsers);

// Get single user by ID
router.get('/:id', authenticateUser,isAdmin,  getUserById);

// Update user details
router.put('/:id', authenticateUser,isAdmin, updateUserDetails);

// Change user role
router.patch('/:id/role', authenticateUser,isAdmin,  updateUserRole);

// Block or Unblock user
router.patch('/:id/status', authenticateUser,isAdmin, blockUnblockUser);

// Delete a user
router.delete('/:id', authenticateUser,isAdmin,  deleteUser);



// Export
export default router;
