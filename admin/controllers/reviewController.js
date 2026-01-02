const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const auditLogger = require('../../services/auditLogger');

/**
 * Get all reviews with pagination and filters
 */
exports.getReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        // Build query
        let query = knex('reviews')
            .select(
                'reviews.*',
                'users.name as customer_name',
                'users.email as customer_email',
                'products.name as product_name',
                'products.product_url as product_image'
            )
            .leftJoin('users', 'reviews.user_id', 'users.id')
            .leftJoin('products', 'reviews.product_id', 'products.product_id')
            .orderBy('reviews.created_at', 'desc');

        // Apply filters
        if (req.query.rating) {
            query = query.where('reviews.rating', req.query.rating);
        }
        if (req.query.status) {
            query = query.where('reviews.status', req.query.status);
        }

        // Get total count
        const countResult = await knex('reviews').count('review_id as count').first();
        const total = parseInt(countResult?.count || 0);

        // Get paginated reviews
        const reviews = await query.limit(limit).offset(offset);

        res.render('admin_views/admin_reviews', {
            reviews,
            pagination: {
                page,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
                total
            },
            filters: req.query,
            success: req.flash('success'),
            error: req.flash('error'),
            currentPage: 'reviews',
            pageTitle: 'Quản lý Đánh giá',
            breadcrumb: ['Quản lý', 'Đánh giá']
        });
    } catch (error) {
        console.error('Get Reviews Error:', error);
        res.render('admin_views/admin_reviews', {
            reviews: [],
            pagination: { page: 1, totalPages: 0, hasNext: false, hasPrev: false, total: 0 },
            filters: {},
            success: req.flash('success'),
            error: req.flash('error'),
            currentPage: 'reviews',
            pageTitle: 'Quản lý Đánh giá',
            breadcrumb: ['Quản lý', 'Đánh giá']
        });
    }
};

/**
 * Update review status (approve/reject)
 */
exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Get old review data
        const oldReview = await knex('reviews').where('review_id', id).first();

        if (!oldReview) {
            return res.status(404).json({ ok: false, message: 'Không tìm thấy đánh giá' });
        }

        // Update status
        await knex('reviews')
            .where('review_id', id)
            .update({ status, updated_at: new Date() });

        // Audit log
        await auditLogger.logStatusChange(
            req.user.id,
            req.user.email,
            'reviews',
            id,
            oldReview.status,
            status,
            req.ip,
            req.get('user-agent')
        );

        res.json({ ok: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error('Update Review Status Error:', error);
        res.status(500).json({ ok: false, message: 'Lỗi server' });
    }
};

/**
 * Delete review
 */
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Get review data for audit log
        const review = await knex('reviews').where('review_id', id).first();

        if (!review) {
            return res.status(404).json({ ok: false, message: 'Không tìm thấy đánh giá' });
        }

        // Delete review
        await knex('reviews').where('review_id', id).del();

        // Audit log
        await auditLogger.logDelete(
            req.user.id,
            req.user.email,
            'reviews',
            id,
            review,
            req.ip,
            req.get('user-agent')
        );

        res.json({ ok: true, message: 'Xóa đánh giá thành công' });
    } catch (error) {
        console.error('Delete Review Error:', error);
        res.status(500).json({ ok: false, message: 'Lỗi server' });
    }
};
