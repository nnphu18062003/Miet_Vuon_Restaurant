const productRepository = require('../repositories/productRepository');
const auditLogger = require('./auditLogger');
const path = require('path');

class ProductService {
    /**
     * Helper to normalize file paths
     */
    _normalizeFilePath(filePath) {
        if (!filePath) return null;
        if (filePath.startsWith('http')) return filePath;

        let normalized = filePath.replace(/\\/g, '/');
        normalized = normalized.replace(/^public\//, '/');
        if (!normalized.startsWith('/')) normalized = '/' + normalized;
        return normalized;
    }

    async createProduct(data, file, user, ip, userAgent) {
        const { name, description, price, category_id, is_best_seller, custom_label, discount, is_discount_active, status } = data;

        let product_url = 'No image provided';
        if (file) {
            product_url = this._normalizeFilePath(file.path) || `/uploads/${file.filename}`;
        }
        // Fallback if file provided but path empty or just filename logic from controller A vs B differentiation
        if (file && !file.path && file.filename) {
            product_url = `/uploads/${file.filename}`;
        }


        const newProduct = await productRepository.create({
            name,
            description,
            price: parseFloat(price),
            category_id: category_id || null,
            product_url,
            status: String(status) === 'true' || status === 'on' || status === '1',
            is_discount_active: is_discount_active === 'true' || is_discount_active === 'on',
            discount: parseFloat(discount) || 0,
            is_best_seller: String(is_best_seller) === 'true' || is_best_seller === 'on',
            custom_label: custom_label || null
        });

        // Audit Log
        if (auditLogger && user) {
            await auditLogger.logCreate(
                user.id,
                user.email,
                'products',
                newProduct.product_id,
                newProduct,
                ip,
                userAgent
            );
        }

        return newProduct;
    }

    async updateProduct(id, data, file, user, ip, userAgent) {
        const { name, description, price, category_id, status, discount, is_discount_active, isNewImage, is_best_seller, custom_label } = data;

        const updateData = {
            name,
            description,
            price: parseFloat(price),
            category_id: category_id || null,
            status: String(status) === 'true' || status === '1' || status === true || status === 'on',
            discount: parseFloat(discount) || 0,
            is_discount_active: is_discount_active === 'true' || is_discount_active === 'on',
            is_best_seller: String(is_best_seller) === 'true' || is_best_seller === 'on',
            custom_label: custom_label || null
        };

        // Update image logic
        if (file && (isNewImage === 'true' || isNewImage === true || file.filename)) {
            // Supports both controller styles (isNewImage flag or just file being present)
            updateData.product_url = this._normalizeFilePath(file.path) || `/uploads/${file.filename}`;
        }

        const oldProduct = await productRepository.findById(id);
        if (!oldProduct) throw new Error('Product not found');

        const updatedProduct = await productRepository.update(id, updateData);

        if (auditLogger && user) {
            await auditLogger.logUpdate(
                user.id,
                user.email,
                'products',
                id,
                oldProduct,
                updatedProduct,
                ip,
                userAgent
            );
        }

        return updatedProduct;
    }

    async deleteProduct(id, user, ip, userAgent) {
        const productToDelete = await productRepository.findById(id);
        if (!productToDelete) throw new Error('Product not found');

        await productRepository.delete(id);

        if (auditLogger && user) {
            await auditLogger.logDelete(
                user.id,
                user.email,
                'products',
                id,
                productToDelete,
                ip,
                userAgent
            );
        }
        return true;
    }

    async getProductsForAdmin({ page = 1, limit = 10, search, category_id }) {
        const offset = (page - 1) * limit;
        const products = await productRepository.findAll({ search, category_id, limit, offset });
        const total = await productRepository.count({ search, category_id });
        const totalPages = Math.ceil(total / limit);

        return {
            products,
            pagination: {
                page,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                total
            }
        };
    }
}

module.exports = new ProductService();
