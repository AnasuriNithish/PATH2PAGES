const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validateRequest');


router.post('/create', protect, validate(['shippingAddress']), orderController.createOrder);
router.post('/verify', protect, validate(['orderId', 'razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature']), orderController.verifyPayment);
// webhook: raw body route - added in index.js


module.exports = router;