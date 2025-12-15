/**
 * Prepare SQL filter statements based on provided inputs.
 * 
 * @param {number} minPrice - Minimum price filter.
 * @param {number} maxPrice - Maximum price filter.
 * @param {string} sort - Sort order (column, direction), e.g. "id,ASC". If not provided will be RANDOM() by default.
 * @param {string} manufacturer - Manufacturer filter.
 * @param {string} search - Search keyword.
 * @param {string} products_category - Category of products, e.g. "mobilephones". If not provided, all products are considered.
 * @returns {Object} Object containing SQL filter statements.
 * @returns {string} priceFilter - SQL statement for price filter. Blank if no price filter is applied.
 * @returns {string} manufacturerFilter - SQL statement for manufacturer filter. Blank if no manufacturer filter is applied.
 * @returns {string} searchFilter - SQL statement for search filter. Blank if no search filter is applied.
 * @returns {string} sortFilter - SQL statement for sort filter. RANDOM() if no sort order were provided
 * @returns {string} productsCategoryFilter - SQL statement for product category filter. Blank if no product category filter is applied.
 * @example
 * const {priceFilter, manufacturerFilter, searchFilter, sortFilter, productsCategoryFilter} = prepareFilterStatements(100, 500, "price,ASC", "Samsung", "Galaxy", "mobilephones");
 */
function prepareFilterStatements(minPrice, maxPrice, sort, search, typeOfFood) {
    let productsCategoryFilter  = typeOfFood === "All" ? "" : `AND c.name IN (${typeOfFood.split(",").map(g => `'${g}'`).join(", ")})`;;
    
    // initialize filters
    let searchFilter = search ? `AND name ILIKE '%${search}%'` : "";
    let priceFilter = ""; 

    if (minPrice !== null && maxPrice !== null) {
        priceFilter = `AND price BETWEEN ${minPrice} AND ${maxPrice}`;
    } else if (minPrice !== null) {
        priceFilter = `AND price >= ${minPrice}`;
    } else if (maxPrice !== null) {
        priceFilter = `AND price <= ${maxPrice}`;
    }

    let sortFilter = "";
    const [sortColumn, sortDir] = sort.split(",");
    
    if(sortColumn != null && sortDir != null) {
        sortFilter = `ORDER BY ${sortColumn} ${sortDir}`;
    } else {
        sortFilter = "ORDER BY RANDOM()";
    }


    
    return {priceFilter, searchFilter, sortFilter, productsCategoryFilter};
}

function prepareFilterStatementsForOrder(status, search) {
    let orderFilter;
    if (status === 'Paid' || status === 'Unpaid') {
        orderFilter = `AND status_payment IN ('${status}')`;
    } else if (status === 'All') {
        orderFilter = "";
    } else {
        orderFilter = `AND status IN ('${status}')`;
    }
    
    let searchFilter = search ? `AND order_code LIKE '%${search}%'` : "";

  
    return { orderFilter, searchFilter };
}

module.exports = {
    prepareFilterStatements,
  prepareFilterStatementsForOrder,
};