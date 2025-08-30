// import express from "express";
// import {
//   createQuotation,
//   getAllQuotations,
//   getUserQuotations,
//   respondQuotation,
//   acceptQuotation,
//   rejectQuotation
// } from "../controllers/quotationController.js";
// import { authenticateUser, isAdmin} from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Customer
// router.post("/create", authenticateUser, createQuotation);         // request quotation
// router.get("/my", authenticateUser, getUserQuotations);      // get logged-in user's quotations
// router.put("/:id/accept", authenticateUser, acceptQuotation); // accept quotation
// router.put("/:id/reject", authenticateUser, rejectQuotation); // reject quotation

// // Admin
// router.get("/", authenticateUser, isAdmin, getAllQuotations);   // list all quotations
// router.put("/:id/respond", authenticateUser, isAdmin, respondQuotation); // admin sets price

// export default router;


// routes/quotationRoutes.js
import express from "express";
import { authenticateUser, isAdmin } from "../middleware/authMiddleware.js";
import {
  createQuotation,
  getUserQuotations,
  getAllQuotations,
  getQuotationById,
  respondQuotation,
  acceptQuotation,
  rejectQuotation
} from "../controllers/quotationController.js";

const router = express.Router();

// Customer
router.post("/create", authenticateUser, createQuotation);
router.get("/my", authenticateUser, getUserQuotations);
router.get("/:id", authenticateUser, getQuotationById); // customer can see own; admin can see all
router.put("/:id/accept", authenticateUser, acceptQuotation);
router.put("/:id/reject", authenticateUser, rejectQuotation);

// Admin
router.get("/", authenticateUser, isAdmin, getAllQuotations); // with filters via query
router.put("/:id/respond", authenticateUser, isAdmin, respondQuotation);

export default router;
