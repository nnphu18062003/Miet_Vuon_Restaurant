/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(
		`CREATE TABLE IF NOT EXISTS categories (
    Category_Id SERIAL PRIMARY KEY,
    Name TEXT
);`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS categories;`);
};