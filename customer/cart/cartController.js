const cartService = require('./cartService');
const productService = require('../product/productService');
const { StatusCodes } = require('http-status-codes');

const addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity = 1} = req.body;
        console.log('Request Body:', req.body); // Debugging log
        if (!user_id || !product_id || !quantity ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const product = await productService.getProductById(product_id);
        console.log('Product:', product.status); // Debugging log

        const result = await cartService.addToCart(user_id, product_id, quantity);
        console.log('Service Result:', result); // Debugging log
        if (result) {
            return res.status(200).json({ message: "Product added to cart successfully", cart: result });
        } else {
            return res.status(500).json({ error: "Failed to add product to cart" });
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart' });
    }
};

const renderCartPage=async (req,res)=>{
    try{
        const user_id = res.locals.user ? res.locals.user.id : null;
        const {products, totalSum, totalDiscount, totalPay}=await cartService.getProductInCartByUserId(user_id);
       
        
        const response = {
            title: 'Cart Page - Miet Vuon Restaurant',
            error: false,
            products: products,
            totalSum: totalSum,
            totalDiscount: totalDiscount,
            user_id:user_id,
            totalPay: totalPay
          };

   

        if(req.xhr){
            return res.status(200).json(response);
        }
         return res.render('cart', response);
    }catch(error){
        console.error('Error rendering cart page:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

const updateQuantity = async (req, res) => {

    try {
        const { userId, productId, newQuantity } = req.body;

        const new_quantity = cartService.updateQuantityInCart(productId, userId, newQuantity);
        if (new_quantity) {
            return res.status(StatusCodes.OK).json({ message: 'Quantity updated successfully' });
        }

    } catch(error) {
        console.error('Error updating quantity in cart:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating quantity in cart' });
    }
}

const deleteProductInCart = async (req, res) => {
    try {
        const {productId, userId} = req.body;
        const success = await cartService.deleteProductInCart(productId, userId);
        if(success){
            return res.status(StatusCodes.OK).json({message: 'Product deleted successfully'});
        }
        else{
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product in cart:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting product in cart' });
    }
}
module.exports = {
    addToCart,
    renderCartPage,
    updateQuantity,
    deleteProductInCart,
};