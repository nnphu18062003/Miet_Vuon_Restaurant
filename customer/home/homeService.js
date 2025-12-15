const pool = require('../../config/database');


async function getBestSallerFood() {
  try {
    const result = await pool.query(
        `
        SELECT p.*
        FROM products p
        ORDER BY sold DESC
        LIMIT 4
        `
    );
    return {
      products: result.rows,
    };
  } catch (error) {
    console.error(`Error fetching best saller food:`, error.message);
    return { totalCount: 0, products: [] };
  }
}

module.exports = {
    getBestSallerFood,
};
