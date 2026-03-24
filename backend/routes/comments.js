const express = require("express");
const pool = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/comments
router.post("/", verifyToken, async (req, res) => {
  const { notice_id, comment_text } = req.body || {};

  if (!notice_id || !comment_text) {
    return res
      .status(400)
      .json({ message: "notice_id and comment_text are required" });
  }

  try {
    await pool.execute(
      "INSERT INTO comments (notice_id, user_id, comment_text) VALUES (?, ?, ?)",
      [notice_id, req.user.id, String(comment_text)]
    );

    return res.json({ message: "Comment added successfully" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/comments/:noticeId
router.get("/:noticeId", async (req, res) => {
  const { noticeId } = req.params;

  try {
    const [rows] = await pool.execute(
      `SELECT c.id, u.name AS username, c.comment_text, c.created_at 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.notice_id = ? 
       ORDER BY c.created_at DESC`,
      [noticeId]
    );

    return res.json({ comments: rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

