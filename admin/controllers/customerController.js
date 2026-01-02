const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

/**
 * Get all customers with pagination and search
 */
exports.getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        // Build query
        let query = knex('users')
            .select(
                'users.*',
                knex.raw('COUNT(DISTINCT orders.order_id) as total_orders'),
                knex.raw('COALESCE(SUM(orders.total), 0) as total_spent')
            )
            .leftJoin('orders', 'users.id', 'orders.user_id')
            .where('users.role', true) // Only customers
            .groupBy('users.id')
            .orderBy('users.created_at', 'desc');

        // Apply search filter
        if (req.query.search) {
            query = query.where(function () {
                this.where('users.name', 'ilike', `%${req.query.search}%`)
                    .orWhere('users.email', 'ilike', `%${req.query.search}%`)
                    .orWhere('users.phone', 'ilike', `%${req.query.search}%`);
            });
        }

        // Get total count
        const countQuery = knex('users')
            .where('users.role', true);

        if (req.query.search) {
            countQuery.where(function () {
                this.where('users.name', 'ilike', `%${req.query.search}%`)
                    .orWhere('users.email', 'ilike', `%${req.query.search}%`)
                    .orWhere('users.phone', 'ilike', `%${req.query.search}%`);
            });
        }

        const countResult = await countQuery.count('id as count').first();
        const total = parseInt(countResult?.count || 0);

        // Get paginated customers
        const customers = await query.limit(limit).offset(offset);

        res.render('admin_views/admin_customers', {
            customers,
            pagination: {
                page,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
                total
            },
            search: req.query.search || '',
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (error) {
        console.error('Get Customers Error:', error);
        res.render('admin_views/admin_customers', {
            customers: [],
            pagination: { page: 1, totalPages: 0, hasNext: false, hasPrev: false, total: 0 },
            search: '',
            success: req.flash('success'),
            error: req.flash('error')
        });
    }
};

/**
 * Get customer order history
 */
exports.getCustomerOrders = async (req, res) => {
    try {
        const { id } = req.params;

        const orders = await knex('orders')
            .select('*')
            .where('user_id', id)
            .orderBy('created_at', 'desc');

        res.json({ orders });
    } catch (error) {
        console.error('Get Customer Orders Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
