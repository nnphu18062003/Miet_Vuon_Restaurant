/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {

  await knex.raw(
  `CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY, 
    user_id INT NOT NULL, 
    total NUMERIC(18, 2) NOT NULL,
    status TEXT CHECK (status IN ('Pending', 'Completed', 'Delivered', 'Confirmed', 'Canceled', 'In Transit')) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    canceled_at TIMESTAMP,
    completed_at TIMESTAMP,
    status_payment TEXT CHECK (status_payment IN ('Paid', 'Unpaid')) DEFAULT 'Unpaid',
    order_code TEXT,
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`);
  
};

exports.down = async function (knex) {
	await knex.raw(`DROP TABLE IF EXISTS orders;`);
};

