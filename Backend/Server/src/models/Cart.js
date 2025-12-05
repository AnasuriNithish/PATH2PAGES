const mongoose = require('mongoose');

// Each product inside a cart
const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },   // snapshot of product name
    price: { type: Number, required: true },  // snapshot of product price
    quantity: { type: Number, default: 1, min: 1 },
});

// Main cart schema
const CartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        items: [CartItemSchema],

        coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },

        total: { type: Number, default: 0 }, // recalculated whenever cart updates
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
