const pool = require("../config/db");

/**
 * Create a new notice.
 * @param {string} title
 * @param {string} content
 * @param {number} created_by - user id of creator
 * @returns {Promise<object>} Newly created notice row shape
 */
async function createNotice(title, content, created_by) {
  // Using a generic department label to keep compatibility with the
  // existing schema that expects a department column.
  const department = "General";

  const [result] = await pool.execute(
    "INSERT INTO notices (title, content, department, created_by) VALUES (?, ?, ?, ?)",
    [String(title).trim(), String(content), String(department).trim(), created_by]
  );

  return {
    id: result.insertId,
    title: String(title).trim(),
    content: String(content),
    department,
    created_by,
  };
}

/**
 * Fetch all notices ordered by most recent first.
 * @returns {Promise<Array<object>>}
 */
async function getAllNotices() {
  const [rows] = await pool.execute(
    "SELECT id, title, content, department, created_by, created_at FROM notices ORDER BY created_at DESC"
  );
  return rows;
}

module.exports = {
  createNotice,
  getAllNotices,
};

