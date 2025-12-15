/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(
		`CREATE TABLE IF NOT EXISTS feedbacks (
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            product_id INT NOT NULL,
            user_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), 
            content TEXT, 
            is_approved BOOLEAN,
            PRIMARY KEY (created_at, product_id, user_id),
            FOREIGN KEY (product_id) REFERENCES products(product_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS feedbacks;`);
};

