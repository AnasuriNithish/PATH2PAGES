// src/routes/admin.js
const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const validate = require("../middleware/validateRequest");

// Protect all admin routes
router.use(protect, adminOnly);

router.get("/orders", adminController.listOrders);
router.put(
  "/orders/:id/status",
  validate(["status"]),
  adminController.updateOrderStatus
);
router.post(
  "/coupons",
  validate(["code", "discountType", "discountValue"]),
  adminController.createCoupon
);
router.put("/coupons/:id", adminController.updateCoupon);
router.get("/analytics", adminController.analytics);

module.exports = router;
