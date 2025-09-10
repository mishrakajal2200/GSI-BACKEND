// controllers/recentActivityController.js
import RecentActivity from "../models/RecentActivity.js";

export const getRecentActivities = async (req, res) => {
  try {
    const activities = await RecentActivity.find()
      .populate("user", "name email") // optional
      .sort({ createdAt: -1 })
      .limit(10); // last 10 activities

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};
