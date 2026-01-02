const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// List customers with search
router.get('/', customerController.getCustomers);

// Get customer order history
router.get('/:id/orders', customerController.getCustomerOrders);

module.exports = router;
