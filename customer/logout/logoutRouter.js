const router = require("express").Router();
const logoutController = require('./logoutController');

router.get('/', logoutController.logout);

module.exports = router;