const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("JWT_SECRET is not set");
    err.statusCode = 500;
    throw err;
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "name, email, and password are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const userRole = role ? String(role).toLowerCase() : "student";
  if (!["admin", "student"].includes(userRole)) {
    return res.status(400).json({ message: "role must be admin or student" });
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);

  try {
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [String(name).trim(), normalizedEmail, hashedPassword, userRole]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.insertId,
        name: String(name).trim(),
        email: normalizedEmail,
        role: userRole,
      },
    });
  } catch (err) {
    // ER_DUP_ENTRY for unique email
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const matches = await bcrypt.compare(String(password), user.password);
    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, role: user.role });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

