const pool = require('../../config/database');
const  prepareFilterService  = require('../Utils/filterStatementUtils');

/**
 * Get all products of a specific category with filters applied and the total number of products.
 * Each record in the result set contains the following fields:
 * - id
 * - name
 * - typeOfFood
 * - price
 * - imageurl
 * - detail
 * - discount
 * - number (number of products)
 * - category_name
 * - total_count (total number of products matching the filters)
 *
 * @param {number} minPrice - Minimum price filter.
 * @param {number} maxPrice - Maximum price filter.
 * @param {number} page - Page number for pagination, expected to be greater than 0.
 * @param {number} limit - Number of items per page.
 * @param {string} sort- Sort order (column, direction). e.g. "id,ASC". If not provided, by default is random order.
 * @param {string} typeOfFood - typeOfFood filter. e.g ["Apple", "Samsung",...].
 * @param {string} search - Search keyword.
 * @param {string} products_category - category of products. e.g. "computers". If not provided, all products will be fetched.
 * @returns {Promise<Object>} An object containing the total count of products and the array of products.
 * @returns {number} return.totalCount - Total number of products matching the filters.
 * @returns {Array} return.products - Array of products.
 * @example
 * const {totalCount, products} = await getAllProductsOftypeOfFoodWithFilterAndCount(0, 1000, 1, 10, "price,ASC", "Apple", "macbook", "computers");
 */
async function getAllProductsOfCategoriesWithFilterAndCount(
  minPrice,
  maxPrice,
  page,
  limit,
  sort,
  search,
  typeOfFood
) {
  try {
    const {
      priceFilter, 
      searchFilter, 
      sortFilter, 
      productsCategoryFilter,
    } = prepareFilterService.prepareFilterStatements(
      minPrice,
      maxPrice,
      sort,
      search,
      typeOfFood
    );

    const result = await pool.query(
      `
            SELECT p.*, c.name as category_name, count(*) over() as total_count 
            FROM products p 
            JOIN categories c ON p.category_id = c.category_id
            WHERE p.deleted=false
            ${productsCategoryFilter}
            ${searchFilter}
            ${priceFilter}
            ${sortFilter}
            LIMIT $1 OFFSET $2`,
      [limit, (page - 1) * limit]
    );

    let count = 0;
    if(result.rows.length > 0){
      count = parseInt(result.rows[0].total_count);
    }

    return {
      totalCount: count,
      products: result.rows,
    };
  } catch (error) {
    console.error(
      `Error fetching ${typeOfFood} products from productService:`,
      error.message
    );
    return { totalCount: 0, products: [] };
  }
}

/**
 * Get all typeProduct of a specific product category.
 *
 * @param {string} products_category category of products, e.g. "computers". If not provided, categories of all products will be fetched. e.g. "computers".
 * @returns {Promise<Array>} An array of typeProduct.
 */
async function getAlltypeProductOfCategory() {
  const typeProductList = await pool.query(`
        SELECT name
        FROM categories
        `);

  const typeProduct = typeProductList.rows.map((row) => row.name);
  return typeProduct;
}

/**
 * Fetches a product by its ID from the database.
 * 
 * @param {number} id - The ID of the product to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the product object if found, or an empty array if not found.
 * @returns {Object} return - The product object.
 * @returns {number} return.id - Product ID.
 * @returns {string} return.name - Product name.
 * @returns {number} return.category_id - Category ID.
 * @returns {number} return.typeOfFood_id - typeOfFood ID.
 * @returns {number} return.price - Product price.
 * @returns {string} return.image_url - URL of the product image.
 * @returns {string} return.detail - Product details.
 * @returns {number} return.discount - Discount on the product.
 * @returns {number} return.number - Number of products.
 * @returns {Date} return.last_modified - Last modified timestamp.
 * @returns {number} return.fps_hz - FPS (Hz).
 * @returns {number} return.screen_width_inches - Screen width in inches.
 * @returns {string} return.status - Product status.
 * @returns {number} return.total_purchased - Total number of products purchased.
 * @returns {string} return.typeOfFood_name - typeOfFood name.
 * @returns {string} return.category_name - Category name.
 * @throws {Error} - Throws an error if there is an issue with the database query.
 * @example
 * const product = await getProductById(1);
 * console.log(product);
 * // {
 * //   id: 1,
 * //   name: 'Product Name',
 * //   category_id: 2,
 * //   typeOfFood_id: 3,
 * //   price: 100,
 * //   image_url: 'http://example.com/image.jpg',
 * //   detail: 'Product details',
 * //   discount: 10,
 * //   number: 50,
 * //   last_modified: '2023-10-01T00:00:00.000Z',
 * //   fps_hz: 60,
 * //   screen_width_inches: 15.6,
 * //   status: 'on stock',
 * //   total_purchased: 200,
 * //   typeOfFood_name: 'typeOfFood Name',
 * //   category_name: 'Category Name'
 * // }
 */
async function getProductById(id) {
  try {
    const query = `
    SELECT p.*, c.name as category_name, p.status
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.product_id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching product by ID', error);
    return [];
  }
}

module.exports = {
    getAllProductsOfCategoriesWithFilterAndCount,
  getAlltypeProductOfCategory,
  getProductById,
};
