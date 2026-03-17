const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Only authenticated users can view dashboard stats; restrict to admin if needed
router.get(
  "/stats",
  verifyToken,
  authorizeRoles("admin"),
  getDashboardStats
);

module.exports = router;

