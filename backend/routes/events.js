const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const eventController = require("../controllers/eventController");

// POST /api/events
// Protected with JWT middleware - Only admin can create events
router.post("/", verifyToken, authorizeRoles("admin"), eventController.createEvent);

// GET /api/events
// Fetch all events
router.get("/", verifyToken, eventController.getEvents);

// GET /api/events/:id
// Fetch single event by id
router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/events/:id
// Update event (Admin only)
router.put("/:id", verifyToken, authorizeRoles("admin"), eventController.updateEvent);

// DELETE /api/events/:id
// Delete event (Admin only)
router.delete("/:id", verifyToken, authorizeRoles("admin"), eventController.deleteEvent);

module.exports = router;
