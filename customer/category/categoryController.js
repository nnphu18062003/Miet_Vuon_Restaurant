const categoryService = require('./categoryService');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');


async function renderCategoryPage(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    let sort = req.query.sort || 'product_id,desc';
    let typeOfFood = req.query.typeOfFood || 'All';
    const search = req.query.search || '';
    const minPrice = req.query.min ? parseInt(req.query.min) : null;
    const maxPrice = req.query.max ? parseInt(req.query.max) : null;
    const userID = res.locals.user ? res.locals.user.id : null;

    const selectedtypeOfFoods = typeOfFood === 'All' ? [] : typeOfFood.split(',');

   
    const { products, total, typeOfFoods } =
      await categoryService.getAllProductsWithFiltersAndCountAndtypeOfFoods(
        minPrice,
        maxPrice,
        page,
        limit,
        sort,
        search,
        typeOfFood
      );
    
    const response = {
      title: 'Category Page - Miet Vuon Restaurant',
      error: false,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      itemsPerPage: limit,
      products: products,
      typeOfFoods: typeOfFoods,
      selectedtypeOfFoods,
      user_id: userID,
    };



    if (req.xhr) {
      return res.json(response);
    }

    return res.render('category', response);
  } catch (error) {
    console.error('Error rendering category page:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

async function renderFoodDetailPage(req, res) {
  try {
    const productID = req.params.id;
    const product = await categoryService.getProductById(productID);
    const userID = res.locals.user ? res.locals.user.id : null;


    const relatedFood = await categoryService.getRelatedFood(productID, 5);

    const TITLE = "Food Detail - Miet Vuon Restaurant";

    res.render("product", { product: product, relatedProducts: relatedFood, title: TITLE, user_id:userID});
  } catch (error) {
    console.error("Error rendering food detail page:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}



module.exports = {
  renderCategoryPage,
  renderFoodDetailPage
};
