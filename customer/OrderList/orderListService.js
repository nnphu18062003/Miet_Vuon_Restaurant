const { user } = require('pg/lib/defaults');
const pool = require('../../config/database');
const  prepareFilterService = require('../Utils/filterStatementUtils');



async function getAllOrderAndOrderItemByUserID(status, search, user_id) {
    try {
      const {
        orderFilter, 
        searchFilter, 
      } = prepareFilterService.prepareFilterStatementsForOrder(status, search);
  
      const result = await pool.query(
        `
        SELECT 
          order_id,
          status AS order_status,
          status_payment,
          order_code,
          total
        FROM orders 
        WHERE user_id=$1
        ${orderFilter}
        ${searchFilter}
        Order by order_code desc`,
        [user_id]
      );
  

      const ordersWithProducts = [];
  
      for (const order of result.rows) {
        order.products = [];

        const detailsResult = await pool.query(`
          SELECT p.product_url, p.name, d.quantity, p.price
          FROM detail_orders d
          JOIN products p ON d.product_id=p.product_id
          WHERE d.order_id=$1
        `, [order.order_id]);
  
        order.products = detailsResult.rows;
  
        ordersWithProducts.push(order);
      }
  
      return ordersWithProducts;
  
    } catch (error) {
      console.error(
        `Error fetching orders and order items from orders:`,
        error.message
      );
      return { orders: [] };
    }
  }  

module.exports ={
    getAllOrderAndOrderItemByUserID
}