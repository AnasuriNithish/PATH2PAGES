// index.js (backend entry)
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const fs = require("fs");
const logger = require("./src/config/logger");
const connectDB = require("./src/config/db");

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;
// TEMP health-check (remove after debugging)
app.get("/api/v1/_health_check", (req, res) => {
  try {
    const authExists = !!require.resolve("./src/routes/auth");
    res.json({ ok: true, authFilePresent: authExists });
  } catch (err) {
    res.json({ ok: true, authFilePresent: false, error: String(err) });
  }
});

// CORS - allow your dev frontends + production origin if needed
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.set("trust proxy", 1);

// rawBody saver for webhooks (Razorpay)
const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) req.rawBody = buf.toString(encoding || "utf8");
};

// Body parsers
app.use(express.json({ verify: rawBodySaver }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Logging and rate limit
app.use(
  morgan("combined", { stream: { write: (s) => logger.info(s.trim()) } })
);
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

// DB
connectDB(process.env.MONGO_URI);

// Uploads static dir
const uploadsPath = path.join(__dirname, "src", "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// ========== ROUTES ==========
// Public health/root
app.get("/", (req, res) => res.send("Travel Scrapbook API"));

// API routers
app.use("/api/v1/auth", require("./src/routes/auth"));
app.use("/api/v1/products", require("./src/routes/products"));

// ---- Use the user-scoped cart mount (recommended) ----
// This matches frontend calls like:
//   /api/v1/user/:userId/cart
app.use("/api/v1/user/:userId/cart", require("./src/routes/cart"));

// Other routes
app.use("/api/v1/orders", require("./src/routes/orders"));
app.use("/api/v1/admin", require("./src/routes/admin"));

// Razorpay webhook - keep raw body verifier for signature validation
app.post(
  "/api/v1/webhook/razorpay",
  express.json({ verify: rawBodySaver }),
  require("./src/controllers/orderController").webhook
);

// ========== Serve React build in production (only if exists) ==========
const buildIndex = path.join(__dirname, "build", "index.html");
if (fs.existsSync(buildIndex)) {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(buildIndex);
  });
}

// Global error handler
app.use(require("./src/middleware/errorHandler"));

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
