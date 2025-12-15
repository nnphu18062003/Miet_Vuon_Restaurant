const homeService = require('./homeService');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { user } = require('pg/lib/defaults');

async function renderHomePage(req, res) {
  try {
    const search = req.query.search || '';
    const userID = res.locals.user ? res.locals.user.id : null;

    console.log(userID);
    
    const { products } =
      await homeService.getBestSallerFood();

    const response = {
      title: 'Homepage - Miet Vuon Restaurant',
      error: false,
      products: products,
      user_id: userID,
    };
    return res.render('home', response);
  } catch (error) {
    console.error('Error rendering home page:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

module.exports = {
  renderHomePage,
};
