/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.raw(
		`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        password TEXT,
        salt TEXT,
        create_at TIMESTAMP,
        update_at TIMESTAMP,
        role BOOLEAN DEFAULT TRUE
);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS users;`);
};
