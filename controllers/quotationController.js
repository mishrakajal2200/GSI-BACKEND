// import Quotation from "../models/Quotation.js";

// // Customer: Create a quotation request
// export const createQuotation = async (req, res) => {
//   try {
//     const { items, budget, specialNotes } = req.body;

//     // ✅ check if auth middleware worked
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "Unauthorized: User not found" });
//     }

//     // ✅ validate items
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "At least one item is required" });
//     }

//     // ✅ create new quotation
//     const quotation = new Quotation({
//       customerId: req.user._id,
//       items,
//       budget: budget || 0,
//       specialNotes: specialNotes || "",
//     });

//     await quotation.save();

//     res.status(201).json({
//       message: "Quotation request submitted successfully",
//       quotation,
//     });
//   } catch (err) {
//     console.error("CreateQuotation Error:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
// // Admin: Get all quotations
// export const getAllQuotations = async (req, res) => {
//   try {
//     const quotations = await Quotation.find()
//       .populate("customerId", "name email")
//       .populate("items.productId", "name price");
//     res.json(quotations);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Customer: Get their own quotations
// export const getUserQuotations = async (req, res) => {
//   try {
//     const quotations = await Quotation.find({ customerId: req.user._id })
//       .populate("items.productId", "name price");
//     res.json(quotations);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Admin: Respond to quotation
// export const respondQuotation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { quotedPrice, validityDate, adminResponse } = req.body;

//     const quotation = await Quotation.findByIdAndUpdate(
//       id,
//       {
//         quotedPrice,
//         validityDate,
//         adminResponse,
//         status: "quoted",
//       },
//       { new: true }
//     );

//     if (!quotation) return res.status(404).json({ message: "Quotation not found" });

//     res.json({ message: "Quotation responded", quotation });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Customer: Accept quotation
// export const acceptQuotation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const quotation = await Quotation.findByIdAndUpdate(
//       id,
//       { status: "accepted" },
//       { new: true }
//     );
//     res.json({ message: "Quotation accepted", quotation });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Customer: Reject quotation
// export const rejectQuotation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const quotation = await Quotation.findByIdAndUpdate(
//       id,
//       { status: "rejected" },
//       { new: true }
//     );
//     res.json({ message: "Quotation rejected", quotation });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// controllers/quotationController.js
import Quotation from "../models/Quotation.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// ---- helpers (email) ----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});
const sendMail = (to, subject, text) =>
  transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text }).catch(console.error);

// ---- CUSTOMER ----
export const createQuotation = async (req, res) => {
  try {
    const { items, budget, specialNotes } = req.body;
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Items required" });

    const quotation = await Quotation.create({
      customerId: req.user._id,
      items,
      budget,
      specialNotes: specialNotes || "",
      status: "pending",
    });

    // notify admin (optional)
    sendMail(process.env.EMAIL_USER, "New Quotation Request", `Quotation ID: ${quotation._id}`);

    res.status(201).json({ message: "Quotation submitted", quotation });
  } catch (e) {
    console.error(e); res.status(500).json({ message: "Server error" });
  }
};

export const getUserQuotations = async (req, res) => {
  try {
    const data = await Quotation.find({ customerId: req.user._id })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};

export const getQuotationById = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id)
      .populate("customerId", "name email")
      .populate("items.productId", "name price");
    if (!q) return res.status(404).json({ message: "Not found" });
    const isOwner = q.customerId._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    res.json(q);
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};

// ---- ADMIN ----
export const getAllQuotations = async (req, res) => {
  try {
    const { status, q, from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      // basic text search on specialNotes
      filter.specialNotes = { $regex: q, $options: "i" };
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const data = await Quotation.find(filter)
      .populate("customerId", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};

export const respondQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotedPrice, validityDate, adminResponse } = req.body;

    const q = await Quotation.findById(id);
    if (!q) return res.status(404).json({ message: "Quotation not found" });
    if (!["pending", "rejected", "quoted"].includes(q.status)) {
      // allow re-quote if quoted but not yet accepted
    }

    q.quotedPrice = quotedPrice;
    q.validityDate = validityDate;
    q.adminResponse = adminResponse;
    q.status = "quoted";
    await q.save();

    // notify customer
    if (q.customerId?.email) {
      sendMail(
        q.customerId.email,
        "Your quotation is ready",
        `Quote #${q._id}\nPrice: ₹${quotedPrice}\nValid until: ${new Date(validityDate).toDateString()}`
      );
    }

    res.json({ message: "Quotation updated", quotation: q });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};

// ---- CUSTOMER accepts/rejects ----
export const acceptQuotation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const q = await Quotation.findById(id).session(session);
    if (!q) { await session.abortTransaction(); return res.status(404).json({ message: "Not found" }); }

    if (q.customerId.toString() !== req.user._id.toString())
      { await session.abortTransaction(); return res.status(403).json({ message: "Forbidden" }); }

    if (q.status !== "quoted")
      { await session.abortTransaction(); return res.status(400).json({ message: "Quotation not in quoted state" }); }

    if (q.validityDate && new Date(q.validityDate) < new Date())
      { await session.abortTransaction(); return res.status(400).json({ message: "Quotation expired" }); }

    q.status = "accepted";
    await q.save({ session });

    // create order
    const order = await Order.create([{
      quotationId: q._id,
      customerId: q.customerId,
      items: q.items.map(it => ({ productId: it.productId, quantity: it.quantity })),
      total: q.quotedPrice ?? 0,
      paymentStatus: "pending",
      fulfillmentStatus: "new",
    }], { session });

    await session.commitTransaction();

    // notify admin (optional)
    sendMail(process.env.EMAIL_USER, "Quotation accepted", `Quotation ${q._id} accepted. Order ${order[0]._id} created.`);
    res.json({ message: "Quotation accepted; order created", quotation: q, order: order[0] });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ message: "Server error" });
  } finally { session.endSession(); }
};

export const rejectQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const q = await Quotation.findById(id);
    if (!q) return res.status(404).json({ message: "Not found" });
    if (q.customerId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    q.status = "rejected";
    await q.save();
    res.json({ message: "Quotation rejected", quotation: q });
  } catch (e) { res.status(500).json({ message: "Server error" }); }
};
