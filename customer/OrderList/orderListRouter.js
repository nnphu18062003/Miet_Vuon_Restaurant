const express = require('express');
const router = express.Router();
const orderListController = require("./orderListController");
const utils = require("../Utils/jwtUtils")

// Route to render the checkout page
router.get('/',utils.authMiddleware({ session: true }) ,orderListController.renderOrderListPage);
module.exports = router;