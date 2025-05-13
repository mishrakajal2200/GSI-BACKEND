import express from "express";
import { getVipProducts } from "../controllers/VipProductController.js";

const router = express.Router();

// GET /api/products/vip
router.get("/vip", getVipProducts);

export default router;
