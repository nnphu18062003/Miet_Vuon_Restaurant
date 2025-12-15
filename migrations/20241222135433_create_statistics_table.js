/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.raw(
		`CREATE TABLE IF NOT EXISTS statistics (
            transaction_date TIMESTAMP PRIMARY KEY,
            revenue NUMERIC(18, 2) NOT NULL,
            customer_count INT NOT NULL
        );`
	);
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS statistics;`);
};

