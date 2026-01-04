const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

require('./login/passport.js');

// Configure multer for file uploads
const uploadDir = 'public/uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Middleware để kiểm tra admin đã đăng nhập chưa
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === false) {
        return next();
    }
    res.redirect('/admin/login');
}

// Database connection
// Database connection
const knex = require('../config/database');
const auditLogger = require('../services/auditLogger');

module.exports = function (app) {
    // Logout route
    router.get('/logout', ensureAdmin, async (req, res) => {
        try {
            // Log logout action
            const auditLogger = require('../services/auditLogger');
            await auditLogger.logAuth(
                req.user.id,
                req.user.email,
                'LOGOUT',
                req.ip,
                req.get('user-agent')
            );

            req.logout((err) => {
                if (err) {
                    console.error('Logout error:', err);
                }
                req.session.destroy(() => {
                    res.redirect('/admin/login');
                });
            });
        } catch (error) {
            console.error('Logout Error:', error);
            res.redirect('/admin/login');
        }
    });

    app.use('/admin', router);

    const knexConfig = require('../knexfile');
    const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

    // Route to fix database categories programmatically
    router.get('/fix-categories', ensureAdmin, async (req, res) => {
        try {
            console.log("Fixing categories triggered by user...");

            // Delete old data
            await knex('products').del();
            await knex('categories').del();

            // Insert new categories
            await knex('categories').insert([
                { category_id: 1, name: 'Đặc sản Miền Tây' },
                { category_id: 2, name: 'Lẩu & Nướng' },
                { category_id: 3, name: 'Cơm & Món Mặn' },
                { category_id: 4, name: 'Bánh Dân Gian' },
                { category_id: 5, name: 'Đồ Uống' }
            ]);

            console.log("Categories fixed successfully.");
            req.flash('success', 'Đã khôi phục danh mục thành công! Hãy thêm lại món ăn.');
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Fix categories error:', error);
            req.flash('error', 'Lỗi khi khôi phục danh mục: ' + error.message);
            res.redirect('/admin/dashboard');
        }
    });


    router.get('/login', (req, res) => {
        res.render('admin_views/admin_login', { error: req.flash('error'), success: req.flash('success') });
    });

    router.post('/login', (req, res, next) => {
        passport.authenticate('admin_strategy', async (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error', info?.message || 'Đăng nhập thất bại');
                return res.redirect('/admin/login');
            }

            req.logIn(user, async (err) => {
                if (err) {
                    return next(err);
                }

                // Log successful login
                const auditLogger = require('../services/auditLogger');
                await auditLogger.logAuth(
                    user.id,
                    user.email,
                    'LOGIN',
                    req.ip,
                    req.get('user-agent')
                );

                req.flash('success', 'Đăng nhập thành công!');
                return res.redirect('/admin/dashboard');
            });
        })(req, res, next);
    });


    // Product Routes (CRUD + Cloudinary)
    const productRoutes = require('./routes/product.route');
    app.use('/admin', ensureAdmin, productRoutes);

    // Audit Logs Route
    const auditLogRoutes = require('./routes/auditLog.route');
    app.use('/admin/audit-logs', ensureAdmin, auditLogRoutes);

    // Order Routes
    const orderRoutes = require('./routes/order.route');
    app.use('/admin/orders', ensureAdmin, orderRoutes);

    // Customer Routes
    const customerRoutes = require('./routes/customer.route');
    app.use('/admin/customer', ensureAdmin, customerRoutes);

    // Review Routes
    const reviewRoutes = require('./routes/review.route');
    app.use('/admin/reviews', ensureAdmin, reviewRoutes);

    // Analytics Route
    router.get('/analytics', ensureAdmin, (req, res) => {
        res.render('admin_views/admin_analytics', {
            currentPage: 'analytics',
            pageTitle: 'Thống kê',
            breadcrumb: ['Thống kê'],
            user: req.user,
            success: req.flash('success'),
            error: req.flash('error')
        });
    });

    // Settings Route
    const settingsRoutes = require('./routes/settings.route');
    router.use('/settings', ensureAdmin, settingsRoutes);

    // Dashboard route
    router.get('/dashboard', ensureAdmin, async (req, res) => {
        try {
            // Fetch revenue (sum of valid orders)
            // Assuming status 'Completed' or similar implies recognised revenue. 
            // For now, let's take all non-canceled orders.
            // Or if status_payment='Paid'

            // Let's sum 'total' from orders table
            const revenueResult = await knex('orders')
                .sum('total as revenue')
                .whereNot('status', 'Canceled') // Exclude canceled orders
                .first();
            const revenue = parseFloat(revenueResult?.revenue || 0);

            const ordersResult = await knex('orders').count('order_id as count').first();
            const totalOrders = parseInt(ordersResult?.count || 0);

            const customersResult = await knex('users').where('role', true).count('id as count').first();
            const totalCustomers = parseInt(customersResult?.count || 0);

            const productsResult = await knex('products').where('deleted', false).count('product_id as count').first();
            const totalProducts = parseInt(productsResult?.count || 0);

            res.render('admin_views/admin_index', {
                revenue,
                totalOrders,
                totalCustomers,
                totalProducts,
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'dashboard',
                pageTitle: 'Dashboard',
                breadcrumb: ['Dashboard'],
                user: req.user
            });
        } catch (error) {
            console.error('Dashboard Error:', error);
            res.render('admin_views/admin_index', {
                revenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
                totalProducts: 0,
                success: req.flash('success'),
                error: req.flash('error')
            });
        }
    });

    // Menu Manager Route (Render View)
    // knex is already initialized above

    router.get('/products', ensureAdmin, async (req, res) => { // Matched with sidebar link
        // Wait, where is the menu page linked? 
        // Let's assume /admin/products or check sidebar.
        // The user didn't show sidebar. Let's standardise on /admin/products
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const search = req.query.search || '';
            const category = req.query.category || '';

            let query = knex('products')
                .leftJoin('categories', 'products.category_id', 'categories.category_id')
                .select('products.*', 'categories.name as category_name')
                .where('products.deleted', false); // Assuming soft delete logic or remove if no 'deleted' column

            if (search) {
                query = query.where('products.name', 'ilike', `%${search}%`);
            }
            if (category) {
                query = query.where('products.category_id', category);
            }

            // Pagination after filtering
            const countQuery = knex('products')
                .count('product_id as count')
                .where('products.deleted', false); // Keep consistent with main query

            if (search) {
                countQuery.where('products.name', 'ilike', `%${search}%`);
            }
            if (category) {
                countQuery.where('products.category_id', category);
            }

            const totalProducts = await countQuery.first();
            const totalPages = Math.ceil(totalProducts.count / limit);

            const products = await query
                .orderBy('products.product_id', 'desc')
                .limit(limit)
                .offset(offset);

            // Get all categories for filter
            const categories = await knex('categories').select('*').orderBy('name');

            res.render('admin_views/admin_products_new', {
                products,
                categories,
                search: '',
                category: '',
                pagination: {
                    page,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                    total: totalProducts.count
                },
                success: req.flash('success'),
                error: req.flash('error')
            });
        } catch (error) {
            console.error("Render Menu Error:", error);
            res.render('admin_views/admin_products_new', {
                products: [],
                categories: [],
                search: '',
                category: '',
                pagination: {},
                success: req.flash('success'),
                error: req.flash('error')
            });
        }
    });

    // POST /admin/products - Create new product
    router.post('/products', ensureAdmin, upload.single('image'), async (req, res) => {
        try {
            const { name, description, price, category_id, discount, is_discount_active, status, is_best_seller, custom_label } = req.body;

            let product_url = '/admin/images/default-food.png';
            if (req.file) {
                product_url = `/uploads/${req.file.filename}`;
            }

            const [product_id] = await knex('products').insert({
                name,
                description,
                price: parseFloat(price),
                category_id: category_id || null,
                product_url,
                discount: parseInt(discount) || 0,
                is_discount_active: is_discount_active === 'on' || is_discount_active === 'true',
                status: status === 'on' || status === 'true',
                is_best_seller: is_best_seller === 'on' || is_best_seller === 'true',
                custom_label: custom_label || null
            }).returning('product_id');

            // Audit log
            await auditLogger.logCreate(
                req.user.id,
                req.user.email,
                'products',
                product_id.product_id || product_id, // Handle checking returning type
                { name, price, category_id, status },
                req.ip,
                req.get('user-agent')
            );

            req.flash('success', 'Thêm món thành công!');
            res.json({ ok: true, product_id });
        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({ ok: false, message: 'Không thể thêm món: ' + error.message });
        }
    });

    // PUT /admin/products/:id - Update product
    router.put('/products/:id', ensureAdmin, upload.single('image'), async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, price, category_id, discount, is_discount_active, status, is_best_seller, custom_label } = req.body;

            const updateData = {
                name,
                description,
                price: parseFloat(price),
                category_id: category_id || null,
                discount: parseInt(discount) || 0,
                is_discount_active: is_discount_active === 'on' || is_discount_active === 'true',
                status: status === 'on' || status === 'true',
                is_best_seller: is_best_seller === 'on' || is_best_seller === 'true',
                custom_label: custom_label || null
            };

            if (req.file) {
                updateData.product_url = `/uploads/${req.file.filename}`;
            }

            const oldProduct = await knex('products').where('product_id', id).first();

            await knex('products').where('product_id', id).update(updateData);

            // Audit log
            await auditLogger.logUpdate(
                req.user.id,
                req.user.email,
                'products',
                id,
                oldProduct,
                updateData,
                req.ip,
                req.get('user-agent')
            );

            req.flash('success', 'Cập nhật món thành công!');
            res.json({ ok: true });
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({ ok: false, message: 'Không thể cập nhật món: ' + error.message });
        }
    });

    // DELETE /admin/products/:id - Delete product
    router.delete('/products/:id', ensureAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const oldProduct = await knex('products').where('product_id', id).first();
            await knex('products').where('product_id', id).delete();

            // Audit log
            await auditLogger.logDelete(
                req.user.id,
                req.user.email,
                'products',
                id,
                oldProduct,
                req.ip,
                req.get('user-agent')
            );

            req.flash('success', 'Xóa món thành công!');
            res.json({ ok: true });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ ok: false, message: 'Không thể xóa món: ' + error.message });
        }
    });

    // Redirect /admin về /admin/dashboard
    router.get('/', ensureAdmin, (req, res) => {
        res.redirect('/admin/dashboard');
    });

    // Handle 404 for admin routes - MUST BE LAST
    // This catches any /admin/* URL that wasn't handled by the specific routes above
    app.use('/admin/*', (req, res) => {
        res.status(404).render('admin_views/admin_404', { layout: false });
    });
};

