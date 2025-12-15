const router = require("express").Router();
const cartController = require("./cartController");
const utils = require("../Utils/jwtUtils");

router.post('/add', cartController.addToCart);
router.get('/',utils.authMiddleware({ session: true }) ,cartController.renderCartPage)
router.post('/update-quantity', cartController.updateQuantity);
router.delete('/delete', cartController.deleteProductInCart);
module.exports = router;