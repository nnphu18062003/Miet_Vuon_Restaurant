const express = require("express");
const router = express.Router();
const categoryController = require("./categoryController"); // Ensure this path is correct


router.get("/", categoryController.renderCategoryPage);
router.get("/:id",categoryController.renderFoodDetailPage)

module.exports = router;
