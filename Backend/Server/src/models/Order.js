const mongoose = require('mongoose');

// Each product inside an order
const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // snapshot of product name
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // snapshot of product price at order time
});

// Main order schema
const OrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [OrderItemSchema],

        shippingAddress: {
            fullName: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
        },

        totalAmount: { type: Number, required: true },

        coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },

        paymentMethod: { type: String, default: 'razorpay' },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },

        orderStatus: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },

        // Razorpay details
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
