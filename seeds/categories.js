/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // Delete products first to avoid foreign key constraint violation
  await knex('products').del()
  await knex('categories').del()
  await knex('categories').insert([
    { category_id: 1, name: 'Đặc sản Miền Tây' },
    { category_id: 2, name: 'Lẩu & Nướng' },
    { category_id: 3, name: 'Cơm & Món Mặn' },
    { category_id: 4, name: 'Bánh Dân Gian' },
    { category_id: 5, name: 'Đồ Uống' }
  ]);
};
