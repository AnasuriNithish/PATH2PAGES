const asyncHandler = require('../middleware/asyncHandler');
const RazorpaySvc = require('../services/razorpayService');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// Create order
exports.createOrder = asyncHandler(async (req, res) => {
    const { totalAmount, items, coupon } = req.body;
    const userId = req.user.id;

    const order = new Order({
        user: userId,
        items,
        totalAmount,
        coupon: coupon || null,
        paymentStatus: 'pending',
        orderStatus: 'created',
    });
    await order.save();

    // create razorpay order
    const razor = await RazorpaySvc.createOrder({
        amount: totalAmount,
        receipt: order._id.toString(),
    });
    order.razorpayOrderId = razor.id;
    await order.save();

    res.status(201).json({
        success: true,
        data: { orderId: order._id, razorpayOrder: razor },
    });
});

// Verify payment
exports.verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const valid = RazorpaySvc.verifySignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });
    if (!valid) return res.status(400).json({ success: false, error: 'Invalid signature' });

    const order = await Order.findById(orderId).populate('user', 'email name');
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.orderStatus = 'processing';
    await order.save();

    // decrement product stock atomically
    for (const it of order.items) {
        const product = await Product.findById(it.product);
        if (!product) continue;
        if (it.variantId) {
            const v = product.variants.id(it.variantId);
            if (v) v.stock = Math.max(0, v.stock - it.quantity);
        } else {
            product.stock = Math.max(0, product.stock - it.quantity);
        }
        await product.save();
    }

    // increment coupon usage if used
    if (order.coupon) {
        const coupon = await Coupon.findById(order.coupon);
        if (coupon) {
            coupon.usedCount = (coupon.usedCount || 0) + 1;
            await coupon.save();
        }
    }

    // clear cart
    await Cart.findOneAndUpdate({ user: order.user }, { items: [], coupon: null, total: 0 });

    // 📧 send confirmation email
    if (order.user && order.user.email) {
        await sendOrderConfirmationEmail(
            order.user.email,
            order._id.toString(),
            order.totalAmount
        );
    }

    res.json({ success: true, data: order });
});

// Webhook endpoint (raw body needed)
exports.webhook = asyncHandler(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const raw = req.rawBody; // filled in server.js with raw body middleware
    const verified = RazorpaySvc.verifyWebhook(raw, signature);
    if (!verified) return res.status(400).send('Invalid webhook');

    const payload = req.body; // parsed
    // handle payment captured event
    if (payload.event === 'payment.captured') {
        const payment = payload.payload.payment.entity;
        const razorOrderId = payment.order_id;
        const order = await Order.findOne({ razorpayOrderId: razorOrderId }).populate('user', 'email name');
        if (order) {
            order.paymentStatus = 'paid';
            order.razorpayPaymentId = payment.id;
            order.orderStatus = 'processing';
            await order.save();

            // decrement stock
            for (const it of order.items) {
                const product = await Product.findById(it.product);
                if (!product) continue;
                if (it.variantId) {
                    const v = product.variants.id(it.variantId);
                    if (v) v.stock = Math.max(0, v.stock - it.quantity);
                } else {
                    product.stock = Math.max(0, product.stock - it.quantity);
                }
                await product.save();
            }

            // increment coupon usage if used
            if (order.coupon) {
                const coupon = await Coupon.findById(order.coupon);
                if (coupon) {
                    coupon.usedCount = (coupon.usedCount || 0) + 1;
                    await coupon.save();
                }
            }

            // clear cart
            await Cart.findOneAndUpdate({ user: order.user }, { items: [], coupon: null, total: 0 });

            // 📧 send confirmation email
            if (order.user && order.user.email) {
                await sendOrderConfirmationEmail(
                    order.user.email,
                    order._id.toString(),
                    order.totalAmount
                );
            }
        }
    }

    res.json({ ok: true });
});
