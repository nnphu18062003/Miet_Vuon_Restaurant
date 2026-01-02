const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const auditLogger = require('../../services/auditLogger');

/**
 * Get all orders with pagination and filters
 */
exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        // Build query with filters
        let query = knex('orders')
            .select(
                'orders.*',
                'users.name as customer_name',
                'users.email as customer_email'
            )
            .leftJoin('users', 'orders.user_id', 'users.id')
            .orderBy('orders.created_at', 'desc');

        // Apply filters
        if (req.query.status) {
            query = query.where('orders.status', req.query.status);
        }
        if (req.query.startDate) {
            query = query.where('orders.created_at', '>=', req.query.startDate);
        }
        if (req.query.endDate) {
            query = query.where('orders.created_at', '<=', req.query.endDate);
        }
        if (req.query.search) {
            query = query.where(function () {
                this.where('users.name', 'ilike', `%${req.query.search}%`)
                    .orWhere('users.email', 'ilike', `%${req.query.search}%`)
                    .orWhere('orders.order_code', 'ilike', `%${req.query.search}%`);
            });
        }

        // Get total count
        const countResult = await query.clone().count('orders.order_id as count').first();
        const total = parseInt(countResult?.count || 0);

        // Get pending orders count for sidebar badge
        const pendingCountResult = await knex('orders').where('status', 'Pending').count('order_id as count').first();
        const pendingOrders = parseInt(pendingCountResult?.count || 0);

        // Get paginated orders
        const orders = await query.limit(limit).offset(offset);

        res.render('admin_views/admin_orders_new', {
            orders,
            pagination: {
                page,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
                total
            },
            filters: req.query,
            currentPage: 'orders',
            pendingOrders,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.render('admin_views/admin_orders_new', {
            orders: [],
            pagination: { page: 1, totalPages: 0, hasNext: false, hasPrev: false, total: 0 },
            filters: {},
            currentPage: 'orders',
            pendingOrders: 0,
            success: req.flash('success'),
            error: req.flash('error')
        });
    }
};

/**
 * Get order details with items
 */
exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Get order with customer info
        const order = await knex('orders')
            .select(
                'orders.*',
                'users.name as customer_name',
                'users.email as customer_email',
                'users.phone as customer_phone'
            )
            .leftJoin('users', 'orders.user_id', 'users.id')
            .where('orders.order_id', id)
            .first();

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Get order items
        const items = await knex('order_items')
            .select(
                'order_items.*',
                'products.name as product_name',
                'products.product_url'
            )
            .leftJoin('products', 'order_items.product_id', 'products.product_id')
            .where('order_items.order_id', id);

        res.json({ order, items });
    } catch (error) {
        console.error('Get Order Details Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Get old order data
        const oldOrder = await knex('orders')
            .where('order_id', id)
            .first();

        if (!oldOrder) {
            return res.status(404).json({ ok: false, message: 'Không tìm thấy đơn hàng' });
        }

        // Update status
        const [updatedOrder] = await knex('orders')
            .where('order_id', id)
            .update({ status, updated_at: new Date() })
            .returning('*');

        // Audit log
        await auditLogger.logStatusChange(
            req.user.id,
            req.user.email,
            'orders',
            id,
            oldOrder.status,
            status,
            req.ip,
            req.get('user-agent')
        );

        res.json({ ok: true, message: 'Cập nhật trạng thái thành công', order: updatedOrder });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ ok: false, message: 'Lỗi server' });
    }
};
