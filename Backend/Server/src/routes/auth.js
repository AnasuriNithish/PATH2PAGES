// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public: register, login
router.post("/register", authController.register);
router.post("/login", authController.login);

// New: check-token - used by frontend to verify whether a token exists for a given email
router.post("/check-token", authController.checkToken);

// Protected: fetch current user
router.get("/me", protect, authController.me);

module.exports = router;
