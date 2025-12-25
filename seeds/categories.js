/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // Delete products first to avoid foreign key constraint violation
  await knex('products').del()
  await knex('categories').del()
  await knex('categories').insert([
    {category_id: 1, name: 'Khai Vị'},
    {category_id: 2, name: 'Món chính'},
    {category_id: 3, name: 'Món phụ'},
    {category_id: 4, name: 'Đồ uống'}
  ]);
};
