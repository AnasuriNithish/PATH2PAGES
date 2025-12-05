// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adjust path if your model lives elsewhere

/**
 * protect - Express middleware to protect routes
 * Expects Authorization header: "Bearer <token>"
 * Verifies token, finds user, attaches req.user
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== "string") {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    // Expect: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res
        .status(401)
        .json({ success: false, error: "Invalid authorization format" });
    }

    const token = parts[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized - token missing" });
    }

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set in environment");
      return res
        .status(500)
        .json({ success: false, error: "Server misconfiguration" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // decoded should contain user id as `id` (per signToken code)
    const userId = decoded.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token payload" });
    }

    // fetch user from DB (remove sensitive fields)
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    // attach user and proceed
    req.user = user;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Server error in auth middleware" });
  }
};

module.exports = protect;
