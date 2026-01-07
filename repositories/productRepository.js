const db = require('./db');

class ProductRepository {
    constructor() {
        this.tableName = 'products';
    }

    async create(data) {
        const [product] = await db(this.tableName)
            .insert(data)
            .returning('*');
        return product;
    }

    async update(id, data) {
        const [updatedProduct] = await db(this.tableName)
            .where({ product_id: id })
            .update(data)
            .returning('*');
        return updatedProduct;
    }

    async delete(id) {
        return db(this.tableName).where({ product_id: id }).del();
    }

    async findById(id) {
        return db(this.tableName).where({ product_id: id }).first();
    }

    async findAll({ search, category_id, limit, offset, sort = 'desc' }) {
        let query = db(this.tableName)
            .leftJoin('categories', 'products.category_id', 'categories.category_id')
            .select('products.*', 'categories.name as category_name')
            .where('products.deleted', false);

        if (search) {
            query = query.where('products.name', 'ilike', `%${search}%`);
        }
        if (category_id) {
            query = query.where('products.category_id', category_id);
        }

        return query
            .orderBy('products.product_id', sort)
            .limit(limit)
            .offset(offset);
    }

    async count({ search, category_id }) {
        const query = db(this.tableName)
            .count('product_id as count')
            .where('products.deleted', false);

        if (search) {
            query.where('products.name', 'ilike', `%${search}%`);
        }
        if (category_id) {
            query.where('products.category_id', category_id);
        }

        const result = await query.first();
        return parseInt(result.count || 0);
    }
}

module.exports = new ProductRepository();
