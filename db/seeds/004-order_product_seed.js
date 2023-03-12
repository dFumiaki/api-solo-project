/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("order_product").del();
  await knex("order_product").insert([
    {
      product_id: 3,
      order_id: 1,
      quantity: "5",
    },
    {
      product_id: 2,
      order_id: 2,
      quantity: "10",
    },
    {
      product_id: 3,
      order_id: 3,
      quantity: "2",
    },
    {
      product_id: 1,
      order_id: 4,
      quantity: "3",
    },
    {
      product_id: 5,
      order_id: 5,
      quantity: "1",
    },
  ]);
};
