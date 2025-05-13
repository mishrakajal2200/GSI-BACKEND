import express from "express";
import {getcosmosproduct } from "../controllers/CosmosController.js";

const router = express.Router();

// GET /api/products/vip
router.get("/cosmos", getcosmosproduct);

export default router;
 