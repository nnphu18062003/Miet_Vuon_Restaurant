/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('reviews', function (table) {
        table.increments('review_id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('product_id').unsigned().references('product_id').inTable('products').onDelete('CASCADE');
        table.integer('rating').notNullable().checkBetween([1, 5]);
        table.text('comment');
        table.string('status', 20).defaultTo('pending'); // pending, approved, rejected
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        // Indexes
        table.index('user_id');
        table.index('product_id');
        table.index('status');
        table.index('rating');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('reviews');
};
