// routes/notifications.js
import express from "express";
const router = express.Router();

// Mock data (replace with DB fetch)
router.get("/", async (req, res) => {
  const notifications = [
    { message: "New product added!" },
    { message: "Order #123 has been placed." },
    { message: "Stock running low on Item X." },
  ];
  res.json(notifications);
});

export default router;
