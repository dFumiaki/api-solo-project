/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("order_info", function (table) {
    table.increments("id").primary(); // Set this column as the primary key
    table.integer("customer_id").notNullable();
    table.foreign("customer_id").references("id").inTable("customer");
    table.date("date_placed").notNullable();
    table.date("date_shipped");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("order_info");
};
