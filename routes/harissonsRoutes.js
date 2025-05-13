import express from "express";
import {getharissonsproduct } from "../controllers/HarissonsController.js";

const router = express.Router();

// GET /api/products/vip
router.get("/harissons", getharissonsproduct);

export default router;
