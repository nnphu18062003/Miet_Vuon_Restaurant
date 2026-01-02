const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('../../config/cloudinary');

// Middleware check admin is handled in parent route or here
// Depending on architecture, we might want to ensure it again or rely on index.route.js

router.post('/create', upload.single('product_url'), productController.createProduct);
router.patch('/products/update', upload.single('product_url'), productController.updateProduct);
router.patch('/products/delete', productController.deleteProduct); // Using PATCH for delete as per frontend AJAX

module.exports = router;
