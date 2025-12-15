/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
        CREATE TABLE IF NOT EXISTS carts (
          user_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          create_At TIMESTAMP,
          order_code TEXT,
          address TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
          PRIMARY KEY (user_id, product_id)
          );`);
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.raw(`DROP TABLE IF EXISTS carts;`);
  };
  