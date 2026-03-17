const express = require("express");
const {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Students & admins can view notices
router.get("/", verifyToken, getNotices);
router.get("/:id", verifyToken, getNoticeById);

// Only admin can modify notices
router.post("/", verifyToken, authorizeRoles("admin"), createNotice);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateNotice);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteNotice);

module.exports = router;

