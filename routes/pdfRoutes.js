import express from 'express';
import { generateQuotation } from '../controllers/ProductController.js';
import  { authenticateUser,isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/generate-quotation',authenticateUser, isAdmin, generateQuotation);

export default router;