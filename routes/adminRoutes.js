


import express from "express";
import { adminLogin, getAdminStats,getRecentOrders,updateOrderStatus} from "../controllers/adminController.js";
import  { authenticateUser,isAdmin } from "../middleware/authMiddleware.js";
import { getRecentActivities } from "../controllers/recentActivityController.js";
const router = express.Router();

router.post("/adminlogin/login", adminLogin);
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // or destroy session
  res.status(200).json({ message: 'Logged out' });
});
router.get("/stats",authenticateUser, isAdmin, getAdminStats);
router.get("/orders/recent", authenticateUser, isAdmin, getRecentOrders);
router.patch("/orders/:id/status", authenticateUser, isAdmin, updateOrderStatus);

router.get("/activities/recent", authenticateUser, isAdmin, getRecentActivities);


export default router;
