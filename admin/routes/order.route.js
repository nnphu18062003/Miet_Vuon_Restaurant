const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// List orders with filters
router.get('/', orderController.getOrders);

// Get order details
router.get('/:id', orderController.getOrderDetails);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
