const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../config/logger');


const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.createOrder = async ({ amount, currency = 'INR', receipt }) => {
    const options = { amount: Math.round(amount * 100), currency, receipt };
    const order = await instance.orders.create(options);
    logger.debug('Razorpay order created', { orderId: order.id });
    return order;
};


exports.verifySignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const generated = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
    return generated === razorpay_signature;
};


exports.verifyWebhook = (rawBody, signature) => {
    const expected = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET).update(rawBody).digest('hex');
    return expected === signature;
};