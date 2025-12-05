const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // new middleware
const productController = require('../controllers/productController');

// Create product with image upload
router.post('/', upload.array('images', 10), productController.createProduct);

// Update product with image upload
router.put('/:id', upload.array('images', 10), productController.updateProduct);

// Other routes
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProduct);
router.get('/', productController.listProducts);

module.exports = router;
