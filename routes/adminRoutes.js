


import express from "express";
import { adminLogin, getAdminStats,getRecentOrders,updateOrderStatus,createProduct} from "../controllers/adminController.js";
import  { authenticateUser,isAdmin } from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/adminlogin/login", adminLogin);
router.get("/stats",authenticateUser, isAdmin, getAdminStats);
router.get("/orders/recent", authenticateUser, isAdmin, getRecentOrders);
router.patch("/orders/:id/status", authenticateUser, isAdmin, updateOrderStatus);

router.post( "/createproduct", authenticateUser,isAdmin,upload.single("image"),createProduct);


export default router;
