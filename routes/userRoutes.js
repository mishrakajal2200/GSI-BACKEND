import express from 'express';
import { loginUser, registerUser,searchProducts, getUserProfile ,updateUserProfile,updateCheckoutDetails} from '../controllers/userController.js';
import authenticateUser from '../middleware/authMiddleware.js'; // ✅ CORRECT IMPORT - No curly braces

const router = express.Router();

// 🛠 Routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

router.put('/checkout', authenticateUser, updateCheckoutDetails);
// GET /api/users/profile - Fetch logged-in user data
router.get('/profile', authenticateUser, getUserProfile);

// PUT /api/users/profile - Update profile
router.put('/ptofile', authenticateUser, updateUserProfile);

router.get("/search", searchProducts);


// router.post('/api/contact', contactFormHandler);

export default router;