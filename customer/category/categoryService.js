const pool = require("../../config/database");
const productService = require("../product/productService");
const {calculateDiscountedPrice} = require("../Utils/discountedPriceUtils.js");

/**
 * Get all products with filters applied, the total number of products, and the list of typeOfFood.
 * Each record in the result set contains the following fields:
 * - id
 * - name
 * - typeOfFood_name
 * - price (discounted price)
 * - image_url
 * - detail
 * - discount
 * - numberofpro (number of products)
 * - type_name (type of product)
 * 
 * @param {number} minPrice - Minimum price filter.
 * @param {number} maxPrice - Maximum price filter.
 * @param {number} page - Page number for pagination, expected to be greater than 0.
 * @param {number} limit - Number of items per page.
 * @param {string} sort - Sort order (column, direction). e.g. "id,ASC". If not provided, by default is random order.
 * @param {string} search - Search keyword.
 * @returns {Promise<Object>} - An object containing the total count of products, the list of products, and the list of typeOfFood.
 * @returns {Array} return.products - List of products with discounted prices.
 * @returns {number} return.total - Total number of products matching the filters.
 * @returns {Array} return.typeOfFood - List of typeOfFood.
 * @example
 * const { products, total, typeOfFood } = await getAllProductsWithFiltersAndCountAndtypeOfFood(0, 1000, 1, 10, "price,ASC", "Apple", "macbook");
 */
async function getAllProductsWithFiltersAndCountAndtypeOfFoods(minPrice, maxPrice, page, limit, sort, search, typeOfFood) {
  try {
    // Ensure page is not less than 1
    page = Math.max(1, page);

    // product_type is not provided, which means 
    // we want to get all products 
    // and the total number of products 
    const {totalCount, products} = 
      await productService.getAllProductsOfCategoriesWithFilterAndCount(
        minPrice,
        maxPrice,
        page,
        limit,
        sort,
        search,
        typeOfFood
      );
      
    // Get all typeOfFood of all products (product_type is not provided)
    const typeOfFoodArray = await productService.getAlltypeProductOfCategory();
    return { products: products, total: totalCount, typeOfFoods: typeOfFoodArray };
  } catch (error) {
    console.error("Error fetching products of all categories:", error.message);
    return { result: [], total: 0, typeOfFoods: [] };
  }
}

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

async function getRelatedFood(currentId, limit = 3) {
  try {
      const query = `
      SELECT p.*, c.name as category_name
      FROM products p JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id = (SELECT category_id from products where product_id=$1)
      AND p.product_id <> $1
      ORDER BY RANDOM() 
      LIMIT $2
      `;
      const result = await pool.query(query, [currentId, limit]);
      return result.rows;
  } catch (error) {
      console.error('Error fetching related food', error);
      return [];
  }
}




module.exports = {
  getAllProductsWithFiltersAndCountAndtypeOfFoods,
  getProductById,
  getRelatedFood
};