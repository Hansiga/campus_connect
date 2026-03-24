const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server misconfigured" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorizeRoles(...roles) {
  const allowed = roles.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    const userRole = req.user?.role ? String(req.user.role).toLowerCase() : "";
    if (!userRole || !allowed.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles,
};

