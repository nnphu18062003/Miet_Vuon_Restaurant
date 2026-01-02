const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const { cloudinary } = require('../../config/cloudinary');
const auditLogger = require('../../services/auditLogger');

// Create Product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, is_best_seller, custom_label } = req.body;

        let product_url = 'No image provided';
        if (req.file) {
            product_url = req.file.path; // Cloudinary URL or Local Path

            // Fix for Local Storage (Windows paths or Public prefix)
            if (!product_url.startsWith('http')) {
                // Convert backslashes to forward slashes
                product_url = product_url.replace(/\\/g, '/');
                // Remove 'public' prefix to make it relative to server root
                product_url = product_url.replace(/^public\//, '/');
                // Ensure it starts with /
                if (!product_url.startsWith('/')) product_url = '/' + product_url;
            }
        }

        const [newProduct] = await knex('products').insert({
            name,
            description,
            price,
            category_id,
            product_url,
            status: true,
            is_discount_active: false,
            discount: 0,
            is_best_seller: String(is_best_seller) === 'true' || is_best_seller === 'on',
            custom_label: custom_label || null
        }).returning('*');

        // Audit log
        await auditLogger.logCreate(
            req.user.id,
            req.user.email,
            'products',
            newProduct.product_id,
            newProduct,
            req.ip,
            req.get('user-agent')
        );

        res.status(201).json({ ok: true, message: 'Thêm món thành công', product: newProduct });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ ok: false, message: 'Lỗi server: ' + error.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { product_id, name, description, price, category_id, status, discount, is_discount_active, isNewImage, is_best_seller, custom_label } = req.body;

        const updateData = {
            name,
            description,
            price,
            category_id,
            status: String(status) === 'true' || status === '1' || status === true,
            discount: parseFloat(discount) || 0,
            is_discount_active: is_discount_active === 'true',
            is_best_seller: String(is_best_seller) === 'true' || is_best_seller === 'on',
            custom_label: custom_label || null
        };

        // Only update image if a new one was uploaded
        if (req.file && isNewImage === 'true') {
            let newUrl = req.file.path;
            if (!newUrl.startsWith('http')) {
                newUrl = newUrl.replace(/\\/g, '/').replace(/^public\//, '/');
                if (!newUrl.startsWith('/')) newUrl = '/' + newUrl;
            }
            updateData.product_url = newUrl;
        }

        // Get old values for audit log
        const oldProduct = await knex('products')
            .where({ product_id })
            .first();

        const [updatedProduct] = await knex('products')
            .where({ product_id })
            .update(updateData)
            .returning('*');

        if (!updatedProduct) {
            return res.status(404).json({ ok: false, message: 'Không tìm thấy món ăn' });
        }

        // Audit log
        await auditLogger.logUpdate(
            req.user.id,
            req.user.email,
            'products',
            product_id,
            oldProduct,
            updatedProduct,
            req.ip,
            req.get('user-agent')
        );

        res.status(200).json({ ok: true, message: 'Cập nhật thành công', product: updatedProduct });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ ok: false, message: 'Lỗi server khi cập nhật món' });
    }
};

// Delete Product (Soft delete or Hard delete based on requirement, code suggests Hard Delete or Flag)
// Based on migration: "deleted BOOLEAN DEFAULT FALSE", so we should Soft Delete.
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        // Get product data before deletion for audit log
        const productToDelete = await knex('products')
            .where({ product_id: id })
            .first();

        if (!productToDelete) {
            return res.status(404).json({ ok: false, message: 'Không tìm thấy món ăn' });
        }

        await knex('products').where({ product_id: id }).del();

        // Audit log
        await auditLogger.logDelete(
            req.user.id,
            req.user.email,
            'products',
            id,
            productToDelete,
            req.ip,
            req.get('user-agent')
        );

        res.status(200).json({ ok: true, message: 'Xóa món thành công' });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ ok: false, message: 'Lỗi server khi xóa món' });
    }
};
