const { user } = require('pg/lib/defaults');
const pool = require('../../config/database');
const  prepareFilterService = require('../Utils/filterStatementUtils');

const getProductInCartByUserIdToOrder= async(user_id)=>{
    try {
        const result=await pool.query(`
             SELECT p.product_url, c.quantity, p.price,
        c.quantity * p.price AS total, p.name, p.product_id,  ROUND(p.price - p.price * COALESCE(p.discount, 0) / 100.0, 2) AS discountprice,
        ROUND(p.price * COALESCE(p.discount, 0) / 100.0,0)*c.quantity AS discountasmoney
        FROM carts c
        JOIN products p ON c.product_id=p.product_id
        WHERE c.user_id=$1
        `,[user_id])

    
        const totalSum = result.rows.reduce((sum, row) => {
          return sum + parseFloat(row.total);
        }, 0);

        const totalDiscount = result.rows.reduce((sumDis, row) => {
          return sumDis + parseFloat(row.discountasmoney);
        }, 0);
      
        
        return {
            products: result.rows,
            totalSum:  parseFloat(totalSum).toFixed(0),
            totalDiscount: parseFloat(totalDiscount.toFixed(0)),
            totalPay: parseFloat((totalSum-totalDiscount).toFixed(0))
        };
    }catch(error){
        console.error('Error fetching product in cart by user id', error);
        return { products: [], totalSum: 0, totalDiscount: 0 };
    }
}

async function createNewOrder(user_id, total, address) {
    try {
        // console.log(total);

        const result = await pool.query(
            `INSERT INTO orders (user_id, total, address) 
             VALUES ($1, $2, $3) RETURNING order_id, order_code`, 
            [user_id, total, address]
        );
        
        const order_id = result.rows[0].order_id;
        const order_code=result.rows[0].order_code
        return {order_id:order_id,order_code:order_code}; 
       
    } catch (error) {
        console.error('Error creating new order by user_id', error);
        throw error; 
    }
}

async function createOrderDetail(order_id,product_id,quantity){
    // console.log(order_id,product_id,quantity);
    try{
        const result=await pool.query(`insert into detail_orders (order_id,product_id,quantity) values($1,$2,$3)`,[order_id,product_id,quantity]);
    }catch(error){
        console.error('Error creating new order detail', error);
        throw error; 
    }
} 

async function findOrderWithDetails(order_code, user_id) {
    try {
      
        const orderResult = await pool.query(`select order_id, total, status from orders where order_code=$1 and user_id=$2`, [order_code,user_id]);
        

        if (orderResult.rows.length === 0) {
            return [];
        }

        const order = orderResult.rows[0]; 
      
        const detailsResult = await pool.query(`
            Select p.product_url, p.name, d.quantity, p.price, ROUND(p.price - p.price * COALESCE(p.discount, 0) / 100.0, 0) AS discountprice
            from detail_orders d 
            join products p on d.product_id=p.product_id
            where d.order_id=$1`, [order.order_id]);
        
    
        return {
            order: order,
            details: detailsResult.rows
        };

    } catch (error) {
        console.error('Error fetching order and details',error);
        return { order: [], details: [] };
    }
}

async function updateOrderStatus(order_code, status) {
    try {
        const orderResult = await pool.query(
            `SELECT order_id, status FROM orders WHERE order_code = $1`, 
            [order_code]
        );

        if (orderResult.rows.length === 0) {
            return { success: false, message: 'Can not find any order.' };
        }

        if(orderResult.rows[0].status==='Canceled'){
            return {success:false,message: 'The order has been canceled'}
        }

        await pool.query(
            `UPDATE orders 
             SET status = $1, 
                 ${status === 'Canceled' ? 'canceled_at = CURRENT_TIMESTAMP,' : ''} 
             updated_at = CURRENT_TIMESTAMP
             WHERE order_code = $2`,
            [status, order_code]
        );
        
        return {success:true,message:'Order has been canceled successfully'};
    } catch (error) {
        console.error('Error when update order status:', error);
        return { success: false};
    }
}



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
        `,
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
    getProductInCartByUserIdToOrder,
    createOrderDetail,
    createNewOrder,
    findOrderWithDetails,
    updateOrderStatus,
    getAllOrderAndOrderItemByUserID
}