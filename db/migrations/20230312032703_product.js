/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("product", function (table) {
    table.increments("id").primary(); // Set this column as the primary key
    table.string("description", 64).notNullable();
    table.decimal("cost_price", 32, 2);
    table.decimal("sell_price", 32, 2);
    table.integer("stock").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("product");
};
