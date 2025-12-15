const checkoutService = require('./checkoutService');
const profileService=require('../profile/profileService');
const cartService=require('../cart/cartService');

const renderCheckoutPage=async (req,res)=>{
    try{
        const user_id = res.locals.user ? res.locals.user.id : null;
        const {products, totalSum, totalDiscount, totalPay}=await checkoutService.getProductInCartByUserIdToOrder(user_id);

        const userProfile = await profileService.getUserProfile(user_id);
        const response = {
            title: 'Order Page - Miet Vuon Restaurant',
            error: false,
            products: products,
            totalSum: totalSum,
            totalDiscount: totalDiscount,
            user_id:user_id,
            totalPay: totalPay,
            userProfile:userProfile
          };

        
         return res.render('checkout', response);
    }catch(error){
        console.error('Error rendering order page:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

async function SaveOrderToDB(req,res){
    try{
        const userID = res.locals.user ? res.locals.user.id : null;
        if (!userID) {
            return res.redirect('/login');
        }
        let products = [];
        if (req.body.products) {
          try {
            products = JSON.parse(req.body.products);
          } catch (error) {
            console.error('Error parsing products JSON:', error);
            return res.status(400).send('Invalid JSON format.');
          }
        }
        if(products.length === 0){
          return res.redirect('/');
        }


        const { name, email, phonenumber, address_line} = req.body;

        const totalPay = parseFloat(req.body.totalPay);
        
        const orderInfo=await checkoutService.createNewOrder(userID,totalPay,address_line);

        for (const product of products) {
          await checkoutService.createOrderDetail(orderInfo.order_id, product.product_id, product.quantity);
          cartService.deleteProductInCart(product.product_id,userID);
        }

        return res.redirect(`/checkout/payment?order_code=${orderInfo.order_code}`);

    }catch(error){
        console.error('Error save customer order:',error);
    }
}



async function renderPaymentPage(req,res){

    const userID = res.locals.user ? res.locals.user.id : null;
    if (!userID) {
        return res.redirect('/login');
    }
    const orderCode = req.query.order_code;
    

    const result=await checkoutService.findOrderWithDetails(orderCode,userID);
    const Order=result.order;
    let orderDetail=[];
    orderDetail=result.details;
    const response={
      title:"Payment - Miet Vuon Restaurant",
      Order:Order,
      orderCode:orderCode,
      orderDetail:orderDetail,
    };
    res.render('payment',response);
}


async function renderOrderListPage(req, res) {
  try {
    let status = req.query.status || 'All';
    const search = req.query.search || '';
   
    const userID = res.locals.user ? res.locals.user.id : null;
    if (!userID) {
        return res.redirect('/login');
    }

    const { orderList } =
      await checkoutService.getAllOrderAndOrderItemByUserID(
        status,
        search,
        userID
      );
    
    let  typeofStatus=['Pending', 'Confirmed', 'Delivered', 'Completed', 'Canceled', 'In Transit'];
    const response = {
      title: 'Order List - Miet Vuon Restaurant',
      orderList: orderList,
      user_id: userID,
      typeOfFoods:typeofStatus,
    };



    if (req.xhr) {
      return res.json(response);
    }

    return res.render('orderList', response);
  } catch (error) {
    console.error('Error rendering order list page:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

module.exports = {
    renderCheckoutPage,
    SaveOrderToDB,
    renderPaymentPage,
    renderOrderListPage
};