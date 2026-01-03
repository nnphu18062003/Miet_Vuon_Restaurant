/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('users', function (table) {
        table.string('google_id').nullable();
        table.string('status').defaultTo('active'); // active, locked, banned
        table.boolean('email_verified').defaultTo(false);
        table.string('verification_token').nullable();
        table.timestamp('verification_token_expires').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('users', function (table) {
        table.dropColumn('google_id');
        table.dropColumn('status');
        table.dropColumn('email_verified');
        table.dropColumn('verification_token');
        table.dropColumn('verification_token_expires');
    });
};
