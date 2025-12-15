/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(
		`CREATE TABLE IF NOT EXISTS addresses (
            address_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            address_line VARCHAR(255) NOT NULL,
            isdefault boolean DEFAULT false,
            FOREIGN KEY (user_id) REFERENCES users(id),
            CONSTRAINT unique_user_address UNIQUE (user_id, address_line)
        );`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS addresses;`);
};

