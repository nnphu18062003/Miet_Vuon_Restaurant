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

        // Build query (Simplified to ensure visibility)
        let query = knex('users')
            .where('users.role', true) // Only customers
            .orderBy('users.create_at', 'desc');

        // Note: Total orders/spent calculation removed from main query to avoid grouping issues.
        // If critical, we can add it back as subqueries later.

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

/**
 * Toggle customer status (locked/active)
 */
exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await knex('users')
            .where('id', id)
            .update({ status: status });

        res.json({ ok: true });
    } catch (error) {
        console.error('Toggle status error:', error);
        res.status(500).json({ ok: false, message: 'Lỗi khi cập nhật trạng thái' });
    }
};
