const router = require("express").Router();
const homeController = require("../home/homeController");

router.get("/", homeController.renderHomePage);

module.exports = router;
