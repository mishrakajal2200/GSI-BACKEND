


import express from "express";
import { adminLogin, getAdminStats,getRecentOrders} from "../controllers/adminController.js";
import  { authenticateUser,isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/adminlogin/login", adminLogin);
router.get("/stats",authenticateUser, isAdmin, getAdminStats);
router.get("/orders/recent", authenticateUser, isAdmin, getRecentOrders);


export default router;
