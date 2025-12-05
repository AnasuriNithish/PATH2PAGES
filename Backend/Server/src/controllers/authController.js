// controllers/authController.js
/**
 * Updated authController
 * - On REGISTER: creates user, signs a JWT, stores it on user.token, returns token + user data
 * - On LOGIN: email-only login that ensures a valid stored token (re-signs if needed)
 * - checkToken: email-only token check + auto re-sign if needed
 * - me: returns current user data
 *
 * Make sure your User schema has a `token` field (String).
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adjust path if needed

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "365d";

// sign a fresh token for a user
const signTokenForUser = (user) => {
  return jwt.sign({ id: String(user._id) }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// verify a token string; returns decoded payload or throws
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Helper: unify response token naming so clients are tolerant
const buildTokenResponse = (token) => {
  return {
    token, // for Myaccount.jsx -> result.token
    accessToken: token, // for any other clients expecting accessToken
  };
};

/**
 * REGISTER
 * Matches Myaccount.jsx signup:
 *  - expects: name, email, password (phone & address optional)
 *  - stores token on user.token
 *  - returns token + user profile
 */
async function register(req, res) {
  try {
    const body = req.body || {};

    const name = body.name && String(body.name).trim();
    const email = body.email && String(body.email).trim().toLowerCase();
    const password = body.password && String(body.password); // optional use

    // Optional fields (Myaccount.jsx currently doesn't send these)
    const phoneRaw =
      body.phone || body.mobile || body.telephone || body.contact || "";
    const phone = phoneRaw && String(phoneRaw).trim();

    const addressRaw =
      body.address || body.fullAddress || body.full_address || "";
    const address = addressRaw && String(addressRaw).trim();

    // Only name + email are strictly required to match the frontend
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: "Invalid email" });
    }

    // prevent duplicate registration
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "Email already registered" });
    }

    // Create user; password/phone/address are optional
    const user = await User.create({
      name,
      email,
      password, // if your schema has this; otherwise it's ignored
      // phone,
      // address,
    });

    // sign token and persist to user (this is what Myaccount.jsx expects)
    const token = signTokenForUser(user);
    user.token = token;
    await user.save();

    const tokenBody = buildTokenResponse(token);

    return res.status(201).json({
      success: true,
      ...tokenBody,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        // phone: user.phone,
        // address: user.address,
      },
    });
  } catch (err) {
    console.error("authController.register error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

/**
 * LOGIN
 *
 * Behavior:
 * - Email-only login to match Myaccount.jsx "token check" login.
 * - Finds user by email.
 * - If user.token missing -> sign, persist and return.
 * - If user.token exists -> verify it. If expired/invalid -> re-sign, persist and return.
 * - Otherwise return existing token.
 */
async function login(req, res) {
  try {
    const { email } = req.body || {};
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, error: "Invalid email" });
    }

    const normalized = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalized });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Email not registered" });
    }

    let token = user.token;

    if (!token) {
      // no token stored -> sign & persist
      token = signTokenForUser(user);
      user.token = token;
      await user.save();
    } else {
      // token exists: verify its validity. If expired/invalid, re-sign & persist.
      try {
        verifyToken(token);
        // valid token, nothing to do
      } catch (err) {
        console.warn(
          "Stored token invalid/expired for user",
          user._id,
          err.name
        );
        token = signTokenForUser(user);
        user.token = token;
        await user.save();
      }
    }

    const tokenBody = buildTokenResponse(token);

    return res.status(200).json({
      success: true,
      ...tokenBody,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        // phone: user.phone,
        // address: user.address,
      },
    });
  } catch (err) {
    console.error("authController.login error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

/**
 * checkToken
 * Returns exists true + valid token/info if user exists.
 * If stored token is missing/expired/invalid -> re-sign and persist so client gets a working token.
 * (You can wire this to /api/v1/auth/check-token if you want a separate endpoint.)
 */
async function checkToken(req, res) {
  try {
    const { email } = req.body || {};
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, error: "Invalid email" });
    }

    const normalized = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalized });

    if (!user) {
      return res.status(200).json({ exists: false });
    }

    let token = user.token;

    if (!token) {
      token = signTokenForUser(user);
      user.token = token;
      await user.save();
      const tokenBody = buildTokenResponse(token);
      return res.status(200).json({
        exists: true,
        ...tokenBody,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          // phone: user.phone,
          // address: user.address,
        },
      });
    }

    // if token exists, verify it; if invalid/expired -> re-sign & persist
    try {
      verifyToken(token);
    } catch (err) {
      console.warn(
        "Stored token invalid/expired for user (checkToken):",
        user._id,
        err.name
      );
      token = signTokenForUser(user);
      user.token = token;
      await user.save();
    }

    const tokenBody = buildTokenResponse(user.token);
    return res.status(200).json({
      exists: true,
      ...tokenBody,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        // phone: user.phone,
        // address: user.address,
      },
    });
  } catch (err) {
    console.error("authController.checkToken error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

/**
 * me - protected route
 * Note: this expects your auth middleware to set req.user (decoded user) OR req.user.id.
 */
async function me(req, res) {
  try {
    const requester = req.user;
    if (!requester || (!requester.id && !requester._id)) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    const userId = requester.id || requester._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        // phone: user.phone,
        // address: user.address,
      },
    });
  } catch (err) {
    console.error("authController.me error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

module.exports = { register, login, me, checkToken };
