// src/routes/cart.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validateRequest");

// Apply protect middleware to all routes in this router
router.use(protect);

// Get user's cart
router.get("/", cartController.getCart);

// Add item to cart (supports both /item and /add for flexibility)
router.post("/item", validate(["productId"]), cartController.addItem);

// Update item quantity in cart
router.put(
  "/item",
  validate(["productId", "quantity"]),
  cartController.updateItem
);

// Apply coupon to cart
router.post("/apply-coupon", validate(["code"]), cartController.applyCoupon);

// Clear cart
router.delete("/clear", cartController.clearCart);

module.exports = router;
