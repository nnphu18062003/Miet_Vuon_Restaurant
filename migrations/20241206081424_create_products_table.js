/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(
		`CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT DEFAULT 'No description provided',
    category_id INT,
    price DECIMAL(18, 2),
    status BOOLEAN DEFAULT TRUE,
    sold INT DEFAULT 0,
    avg_rating FLOAT  DEFAULT 0,
    product_Url TEXT DEFAULT 'No image provided',
    discount INTEGER DEFAULT 0,
    is_discount_active BOOLEAN DEFAULT FALSE,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)

);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS products;`);
};

