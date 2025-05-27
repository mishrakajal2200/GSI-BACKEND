// import express from 'express';
// import { loginUser, registerUser,searchProducts, getUserProfile ,updateUserProfile,updateCheckoutDetails,getAllUsers} from '../controllers/userController.js';
// import authenticateUser from '../middleware/authMiddleware.js'; // ✅ CORRECT IMPORT - No curly braces

// const router = express.Router();

// // 🛠 Routes
// router.post('/signup', registerUser);
// router.post('/login', loginUser);

// router.put('/checkout', authenticateUser, updateCheckoutDetails);
// // GET /api/users/profile - Fetch logged-in user data
// router.get('/profile', authenticateUser, getUserProfile);

// // PUT /api/users/profile - Update profile
// router.put('/ptofile', authenticateUser, updateUserProfile);

// router.get("/search", searchProducts);

// // Get all users (Admin only)
// router.get('/', authenticateUser, isAdmin, getAllUsers);

// // Get single user by ID
// router.get('/:id', authenticateUser, isAdmin, getUserById);

// // Update user details
// router.put('/:id', authenticateUser, isAdmin, updateUserDetails);

// // Change user role
// router.patch('/:id/role', authenticateUser, isAdmin, updateUserRole);

// // Block or Unblock user
// router.patch('/:id/status', authenticateUser, isAdmin, blockUnblockUser);

// // Delete a user
// router.delete('/:id', authenticateUser, isAdmin, deleteUser);

// // router.post('/api/contact', contactFormHandler);

// export default router;




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

import authenticateUser from '../middleware/authMiddleware.js';
// import isAdmin from '../middleware/adminMiddleware.js'; // Optional middleware to restrict to admins

const router = express.Router();

// Auth routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// User profile routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/ptofile', authenticateUser, updateUserProfile);

// Checkout route
router.put('/checkout', authenticateUser, updateCheckoutDetails);

// Search
router.get("/search", searchProducts);

// 👇 Admin User Management Routes

// Get all users (Admin only)
router.get('/', authenticateUser, getAllUsers);

// Get single user by ID
router.get('/:id', authenticateUser,  getUserById);

// Update user details
router.put('/:id', authenticateUser, updateUserDetails);

// Change user role
router.patch('/:id/role', authenticateUser,  updateUserRole);

// Block or Unblock user
router.patch('/:id/status', authenticateUser, blockUnblockUser);

// Delete a user
router.delete('/:id', authenticateUser,  deleteUser);

// Export
export default router;
