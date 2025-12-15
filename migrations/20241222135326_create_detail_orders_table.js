/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(
    `CREATE TABLE IF NOT EXISTS detail_orders (
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            PRIMARY KEY (order_id, product_id),
            FOREIGN KEY (order_id) REFERENCES orders(order_id),
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        );`
  );

// <<<<<<< HEAD
//   await knex.raw(`
//     CREATE OR REPLACE FUNCTION update_order_total()
//     RETURNS TRIGGER AS $$
//     BEGIN
//         UPDATE orders
//         SET total = (
//         SELECT SUM(
//             CASE 
//                 WHEN products.is_discount_active = true THEN products.price * (1 - products.discount/100.0) * detail_orders.quantity
//                 ELSE products.price * detail_orders.quantity
//             END
//         )
//         FROM detail_orders 
//         JOIN products  ON detail_orders.product_id = products.product_id
//         WHERE detail_orders.order_id = NEW.order_id
//     )
//         WHERE orders.order_id = NEW.order_id;
// =======
  // await knex.raw(`
  //   CREATE OR REPLACE FUNCTION update_order_total()
  //   RETURNS TRIGGER AS $$
  //   BEGIN
  //       UPDATE orders
  //       SET total = (
  //       SELECT SUM(
  //           CASE 
  //               WHEN products.is_discount_active = true THEN products.price * (1 - products.discount) * detail_orders.quantity
  //               ELSE products.price * detail_orders.quantity
  //           END
  //       )
  //       FROM detail_orders 
  //       JOIN products  ON detail_orders.product_id = products.product_id
  //       WHERE detail_orders.order_id = NEW.order_id
  //   )
  //       WHERE orders.order_id = NEW.order_id;
// >>>>>>> 49665eb407bf18bc2efb38bbfa177d75b13577a1

  //       RETURN NEW;
  //   END;
  //   $$ LANGUAGE plpgsql;
  // `);

 

  await knex.raw(`
    CREATE SEQUENCE IF NOT EXISTS order_code_seq  START 1;
  `);

  await knex.raw(`
    CREATE OR REPLACE FUNCTION generate_order_code()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.order_code := 'DH' || LPAD(nextval('order_code_seq')::TEXT, 3, '0');
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER trg_generate_order_code
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_code();
  `);

  await knex.raw(`
    SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products));
  `);
};

exports.down = async function (knex) {
  await knex.raw(`DROP TABLE IF EXISTS detail_orders;`);
  await knex.raw(`DROP TRIGGER IF EXISTS trg_update_order_total ON detail_orders`);
  await knex.raw(`DROP FUNCTION IF EXISTS update_order_total`);

  await knex.raw(`DROP TRIGGER IF EXISTS trg_generate_order_code ON orders`);
  await knex.raw(`DROP FUNCTION IF EXISTS generate_order_code`);

  await knex.raw(`DROP SEQUENCE IF EXISTS order_code_seq`);
};

