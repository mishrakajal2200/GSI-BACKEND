import express from "express";
import { getAmericanProducts } from "../controllers/AmericanProductController.js";

const router = express.Router();

// GET /api/products/vip
router.get("/american", getAmericanProducts);

export default router;
