const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Students & admins can view events
router.get("/", verifyToken, getEvents);
router.get("/:id", verifyToken, getEventById);

// Only admin can modify events
router.post("/", verifyToken, authorizeRoles("admin"), createEvent);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateEvent);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteEvent);

module.exports = router;

