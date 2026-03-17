const pool = require("../config/db");

exports.createEvent = async (req, res) => {
  const { title, description, date, venue } = req.body || {};

  if (!title || !description || !date || !venue) {
    return res.status(400).json({
      message: "title, description, date and venue are required",
    });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO events (title, description, date, venue, created_by) VALUES (?, ?, ?, ?, ?)",
      [
        String(title).trim(),
        String(description),
        new Date(date),
        String(venue).trim(),
        req.user.id,
      ]
    );

    return res.status(201).json({
      message: "Event created successfully",
      event: {
        id: result.insertId,
        title: String(title).trim(),
        description: String(description),
        date: new Date(date),
        venue: String(venue).trim(),
        created_by: req.user.id,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, description, date, venue, created_by, created_at FROM events ORDER BY date ASC"
    );
    return res.json(rows);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT id, title, description, date, venue, created_by, created_at FROM events WHERE id = ? LIMIT 1",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, venue } = req.body || {};

  if (!title && !description && !date && !venue) {
    return res.status(400).json({
      message:
        "At least one field (title, description, date, venue) is required",
    });
  }

  try {
    const [existingRows] = await pool.execute(
      "SELECT id FROM events WHERE id = ? LIMIT 1",
      [id]
    );
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const fields = [];
    const values = [];

    if (title) {
      fields.push("title = ?");
      values.push(String(title).trim());
    }
    if (description) {
      fields.push("description = ?");
      values.push(String(description));
    }
    if (date) {
      fields.push("date = ?");
      values.push(new Date(date));
    }
    if (venue) {
      fields.push("venue = ?");
      values.push(String(venue).trim());
    }

    values.push(id);

    await pool.execute(
      `UPDATE events SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return res.json({ message: "Event updated successfully" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM events WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

