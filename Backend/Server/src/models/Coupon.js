const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      index: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    discountValue: { type: Number, required: true }, // percentage(%) or flat amount
    minOrderValue: { type: Number, default: 0 },

    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },

    validFrom: { type: Date },
    validTo: { type: Date },

    active: { type: Boolean, default: true },

    // 🎯 Targeting products/categories
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: String, enum: ["scrapbook", "bookmark"] }],
  },
  { timestamps: true }
);

// 🎯 Method to calculate discounted price for a product
CouponSchema.methods.getDiscountedPrice = function (productPrice) {
  if (this.discountType === "percentage") {
    return productPrice - (productPrice * this.discountValue) / 100;
  }
  if (this.discountType === "flat") {
    return Math.max(productPrice - this.discountValue, 0);
  }
  return productPrice;
};

module.exports = mongoose.model("Coupon", CouponSchema);
