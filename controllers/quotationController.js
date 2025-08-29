import Quotation from "../models/Quotation.js";

// Customer: Create a quotation request
export const createQuotation = async (req, res) => {
  try {
    const { items, budget, specialNotes } = req.body;

    // ✅ check if auth middleware worked
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ✅ validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    // ✅ create new quotation
    const quotation = new Quotation({
      customerId: req.user._id,
      items,
      budget: budget || 0,
      specialNotes: specialNotes || "",
    });

    await quotation.save();

    res.status(201).json({
      message: "Quotation request submitted successfully",
      quotation,
    });
  } catch (err) {
    console.error("CreateQuotation Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Admin: Get all quotations
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("customerId", "name email")
      .populate("items.productId", "name price");
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Customer: Get their own quotations
export const getUserQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ customerId: req.user._id })
      .populate("items.productId", "name price");
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Respond to quotation
export const respondQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotedPrice, validityDate, adminResponse } = req.body;

    const quotation = await Quotation.findByIdAndUpdate(
      id,
      {
        quotedPrice,
        validityDate,
        adminResponse,
        status: "quoted",
      },
      { new: true }
    );

    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    res.json({ message: "Quotation responded", quotation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Customer: Accept quotation
export const acceptQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );
    res.json({ message: "Quotation accepted", quotation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Customer: Reject quotation
export const rejectQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    res.json({ message: "Quotation rejected", quotation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
