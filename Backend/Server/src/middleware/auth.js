// src/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect - middleware to require a valid JWT in Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Token invalid or expired" });
  }
};

/**
 * adminOnly - require logged in user to be an admin
 */
const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, error: "Admin only" });
  }
  next();
};

module.exports = { protect, adminOnly };
