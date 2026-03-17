const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [[usersRow]] = await pool.execute(
      "SELECT COUNT(*) AS users FROM users"
    );
    const [[eventsRow]] = await pool.execute(
      "SELECT COUNT(*) AS events FROM events"
    );
    const [[noticesRow]] = await pool.execute(
      "SELECT COUNT(*) AS notices FROM notices"
    );

    return res.json({
      users: Number(usersRow.users) || 0,
      events: Number(eventsRow.events) || 0,
      notices: Number(noticesRow.notices) || 0,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

