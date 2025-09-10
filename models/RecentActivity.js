// models/RecentActivity.js
import mongoose from "mongoose";

const recentActivitySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to admin/user
      required: true,
    },
  },
  { timestamps: true } // auto adds createdAt + updatedAt
);

export default mongoose.model("RecentActivity", recentActivitySchema);
