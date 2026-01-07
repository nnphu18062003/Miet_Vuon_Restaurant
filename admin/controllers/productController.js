const productService = require('../../services/productService');
const catchAsync = require('../../utils/catchAsync');
const { BadRequestError, NotFoundError } = require('../../utils/httpErrors');

// Get Products (Admin View)
exports.getProducts = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const category = req.query.category || '';

    const { products, pagination } = await productService.getProductsForAdmin({ page, limit: 10, search, category_id: category });

    const knex = require('../../repositories/db');
    const categories = await knex('categories').select('*').orderBy('name');

    res.render('admin_views/admin_products_new', {
        products,
        categories,
        search,
        category,
        pagination,
        success: req.flash('success'),
        error: req.flash('error')
    });
});

// Create Product
exports.createProduct = catchAsync(async (req, res) => {
    if (!req.body.name || !req.body.price) {
        throw new BadRequestError('Name and Price are required');
    }
    const product = await productService.createProduct(req.body, req.file, req.user, req.ip, req.get('user-agent'));
    res.status(201).json({ ok: true, message: 'Thêm món thành công', product });
});


// Update Product
exports.updateProduct = async (req, res) => {
    try {
        // If id is in valid params or body
        const id = req.params.id || req.body.product_id;
        const product = await productService.updateProduct(id, req.body, req.file, req.user, req.ip, req.get('user-agent'));
        res.status(200).json({ ok: true, message: 'Cập nhật thành công', product });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ ok: false, message: 'Lỗi server khi cập nhật món: ' + error.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id || req.body.id;
        await productService.deleteProduct(id, req.user, req.ip, req.get('user-agent'));
        res.status(200).json({ ok: true, message: 'Xóa món thành công' });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ ok: false, message: 'Lỗi server khi xóa món: ' + error.message });
    }
};

