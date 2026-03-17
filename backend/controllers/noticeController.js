const pool = require("../config/db");

exports.createNotice = async (req, res) => {
  const { title, content } = req.body || {};

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "title and content are required" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO notices (title, content, created_by) VALUES (?, ?, ?)",
      [String(title).trim(), String(content), req.user.id]
    );

    return res.status(201).json({
      message: "Notice created successfully",
      notice: {
        id: result.insertId,
        title: String(title).trim(),
        content: String(content),
        created_by: req.user.id,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, content, created_by, created_at FROM notices ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getNoticeById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT id, title, content, created_by, created_at FROM notices WHERE id = ? LIMIT 1",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateNotice = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body || {};

  if (!title && !content) {
    return res.status(400).json({
      message: "At least one field (title, content) is required",
    });
  }

  try {
    const [existingRows] = await pool.execute(
      "SELECT id FROM notices WHERE id = ? LIMIT 1",
      [id]
    );
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const fields = [];
    const values = [];

    if (title) {
      fields.push("title = ?");
      values.push(String(title).trim());
    }
    if (content) {
      fields.push("content = ?");
      values.push(String(content));
    }

    values.push(id);

    await pool.execute(
      `UPDATE notices SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return res.json({ message: "Notice updated successfully" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM notices WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }

    return res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

