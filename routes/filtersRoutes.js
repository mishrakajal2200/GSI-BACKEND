// routes/filtersRoutes.js

import express from "express";
import { getBrands, getCategories } from "../controllers/filtersController.js";

const router = express.Router();

// Define the route for fetching brands
router.get("/brands", getBrands);

// Define the route for fetching categories
router.get("/categories", getCategories);

export default router;
