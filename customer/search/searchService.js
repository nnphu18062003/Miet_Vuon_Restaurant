const pool = require("../../config/database");

async function searchAllProducts(query) {
  try {
    if (!query) {
      console.error("Query is empty or undefined");
      return [];
    }

    const sqlQuery = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE (p.name ILIKE $1 OR p.description ILIKE $1) And p.deleted=false 
    `;
    const queryParams = [`%${query}%`];
  
    const result = await pool.query(sqlQuery, queryParams);
    
    return result.rows;
  } catch (error) { 
    console.error("Error searching foods:", error.message);
    return [];
  }
}

module.exports = {
  searchAllProducts,
};