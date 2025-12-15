const orderListService = require('./orderListService');



async function renderOrderListPage(req, res) {
  try {
    let status = req.query.status || 'All';
    const search = req.query.search || '';

    console.log(status);
   
    const userID = res.locals.user ? res.locals.user.id : null;
    if (!userID) {
        return res.redirect('/login');
    }

    const  orderList  =
      await orderListService.getAllOrderAndOrderItemByUserID(
        status,
        search,
        userID
      );

 
    

    const response = {
      title: 'Order List - Miet Vuon Restaurant',
      orderList: orderList,
      user_id: userID,
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
    renderOrderListPage
};