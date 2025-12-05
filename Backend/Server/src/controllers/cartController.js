const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const asyncHandler = require('../middleware/asyncHandler');


const recalc = async (cart) => {
    let total = 0;
    for (const it of cart.items) {
        total += it.price * it.quantity;
    }
    if (cart.coupon) {
        const coupon = await Coupon.findById(cart.coupon);
        if (coupon && coupon.active) {
            if (coupon.discountType === 'flat') total = Math.max(0, total - coupon.discountValue);
            else total = Math.max(0, total * (1 - coupon.discountValue / 100));
        }
    }
    cart.total = total;
    await cart.save();
    return cart;
};


exports.getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product').populate('coupon');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json({ success: true, data: cart });
});


exports.addItem = asyncHandler(async (req, res) => {
    const { productId, variantId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });


    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });


    const price = variantId ? (product.variants.id(variantId).price || product.price) : product.price;
    const name = product.name + (variantId ? ` - ${product.variants.id(variantId).name}` : '');


    const idx = cart.items.findIndex((i) => i.product.toString() === productId && String(i.variantId || '') === String(variantId || ''));
    if (idx > -1) {
        cart.items[idx].quantity += quantity;
        cart.items[idx].price = price;
    } else {
        cart.items.push({ product: productId, variantId, name, price, quantity });
    }
    await recalc(cart);
    res.json({ success: true, data: cart });
});


exports.updateItem = asyncHandler(async (req, res) => {
    const { productId, variantId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });
    const idx = cart.items.findIndex((i) => i.product.toString() === productId && String(i.variantId || '') === String(variantId || ''));
    if (idx === -1) return res.status(404).json({ success: false, error: 'Item not found' });
    if (quantity <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].quantity = quantity;
    await recalc(cart);
    res.json({ success: true, data: cart });
});


exports.applyCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ success: false, error: 'Coupon invalid' });
    if (coupon.validFrom && coupon.validFrom > new Date()) return res.status(400).json({ success: false, error: 'Coupon not active yet' });
    if (coupon.validTo && coupon.validTo < new Date()) return res.status(400).json({ success: false, error: 'Coupon expired' });


    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });


    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });


    cart.coupon = coupon._id;
    await recalc(cart);
    res.json({ success: true, data: cart });
});


exports.clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], coupon: null, total: 0 }, { new: true, upsert: true });
    res.json({ success: true, data: cart });
});