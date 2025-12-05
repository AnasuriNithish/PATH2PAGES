const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const path = require('path');

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const payload = req.body;

  // If files are uploaded, replace `images` with file paths
  if (req.files && req.files.length > 0) {
    payload.images = req.files.map((file) => `/uploads/${file.filename}`);
  } else if (payload.images && !Array.isArray(payload.images)) {
    payload.images = [payload.images]; // fallback for URL-only
  }

  const product = await Product.create(payload);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const updateData = req.body;

  // Handle existing images
  if (updateData.existingImages) {
    try {
      const existingImages = JSON.parse(updateData.existingImages);
      updateData.images = existingImages;
    } catch (err) {
      console.error('Error parsing existing images:', err);
    }
  }

  // If new files are uploaded, add them to existing images
  if (req.files && req.files.length > 0) {
    const newImagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    updateData.images = [...(updateData.images || []), ...newImagePaths];
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, data: product });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, data: 'Deleted' });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, data: product });
});

// @desc    List products with filters
// @route   GET /api/products
// @access  Public
exports.listProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, q, category, minPrice, maxPrice, minStock, maxStock } = req.query;

  const match = {}; // removed isActive filter

  if (category) {
    match.category = category;
  }

  if (q) {
    match.$text = { $search: q };
  }

  if (minPrice || maxPrice) {
    match.price = {};
    if (minPrice) match.price.$gte = Number(minPrice);
    if (maxPrice) match.price.$lte = Number(maxPrice);
  }

  if (minStock || maxStock) {
    match.stock = {};
    if (minStock) match.stock.$gte = Number(minStock);
    if (maxStock) match.stock.$lte = Number(maxStock);
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(match)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await Product.countDocuments(match);

  res.json({
    success: true,
    data: {
      products,
      meta: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
    },
  });
});

