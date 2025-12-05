const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');


exports.listOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const match = {};
    if (status) match.orderStatus = status;
    const skip = (page - 1) * limit;
    const orders = await Order.find(match).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).populate('user');
    const total = await Order.countDocuments(match);
    res.json({ success: true, data: { orders, meta: { total, page: parseInt(page, 10) } } });
});


exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order });
});


exports.createCoupon = asyncHandler(async (req, res) => {
    const payload = req.body;
    payload.code = payload.code.toUpperCase();
    const coupon = await Coupon.create(payload);
    res.status(201).json({ success: true, data: coupon });
});


exports.updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, error: 'Coupon not found' });
    res.json({ success: true, data: coupon });
});


exports.analytics = asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days || '30', 10);
    const from = new Date();
    from.setDate(from.getDate() - days);


    // daily revenue
    const sales = await Order.aggregate([
        { $match: { createdAt: { $gte: from }, paymentStatus: 'paid' } },
        { $project: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, totalAmount: 1 } },
        { $group: { _id: '$day', revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);


    // top products
    const top = await Order.aggregate([
        { $match: { createdAt: { $gte: from }, paymentStatus: 'paid' } },
        { $unwind: '$items' },
        { $group: { _id: '$items.product', sold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } } } },
        { $sort: { sold: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        { $project: { sold: 1, revenue: 1, productName: '$product.name' } },
    ]);


    // totals
    const totals = await Order.aggregate([
        { $match: { createdAt: { $gte: from }, paymentStatus: 'paid' } },
        { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    ]);


    res.json({ success: true, data: { sales, top, totals: totals[0] || { revenue: 0, orders: 0 } } });
});