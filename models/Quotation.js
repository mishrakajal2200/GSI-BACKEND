// import mongoose from "mongoose";

// const QuotationSchema = new mongoose.Schema(
//   {
//     customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     items: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//         quantity: { type: Number, required: true },
//       }
//     ],

//     budget: { type: Number },
//     specialNotes: { type: String },

//     quotedPrice: { type: Number },   // price admin gives
//     validityDate: { type: Date },
//     adminResponse: { type: String },

//     status: {
//       type: String,
//       enum: ["pending", "quoted", "accepted", "rejected"],
//       default: "pending"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Quotation", QuotationSchema);


// models/Quotation.js
import mongoose from "mongoose";

const QuotationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  budget: { type: Number, required: true },
  specialNotes: { type: String, trim: true },

  // Admin response
  quotedPrice: { type: Number },
  validityDate: { type: Date },
  adminResponse: { type: String, trim: true },

  status: { type: String, enum: ["pending", "quoted", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Quotation", QuotationSchema);
