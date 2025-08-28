import express from "express";
import {
  createQuotation,
  getAllQuotations,
  getUserQuotations,
  respondQuotation,
  acceptQuotation,
  rejectQuotation
} from "../controllers/quotationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer
router.post("/", protect, createQuotation);         // request quotation
router.get("/my", protect, getUserQuotations);      // get logged-in user's quotations
router.put("/:id/accept", protect, acceptQuotation); // accept quotation
router.put("/:id/reject", protect, rejectQuotation); // reject quotation

// Admin
router.get("/", protect, admin, getAllQuotations);   // list all quotations
router.put("/:id/respond", protect, admin, respondQuotation); // admin sets price

export default router;
