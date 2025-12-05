const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: String, enum: ["scrapbook", "bookmark"], required: true },
    price: { type: Number, required: true }, // base price
    stock: { type: Number, default: 0 },

    // ✅ Store multiple image URLs for uploaded product images
    // Admin can add/remove images before saving, frontend will sync array
    images: {
      type: [String],
      validate: {
        validator: (val) => Array.isArray(val) && val.length >= 0,
        message: "Images must be an array of strings (URLs).",
      },
    },

    purchasedCount: { type: Number, default: 0 }, // how many customers bought this
  },
  { timestamps: true }
);

// 🔎 Text search optimization
ProductSchema.index({ name: "text", description: "text" });

// 🎯 Virtual field for discounted price (computed dynamically)
ProductSchema.virtual("finalPrice").get(function () {
  // Default: return base price
  return this.price;
});

module.exports = mongoose.model("Product", ProductSchema);
