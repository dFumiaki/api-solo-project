/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("product").del();
  await knex("product").insert([
    {
      id: 1,
      description: "tv",
      cost_price: "200000",
      sell_price: "300000",
      stock: "10",
    },
    {
      id: 2,
      description: "book",
      cost_price: "2000",
      sell_price: "3000",
      stock: "100",
    },
    {
      id: 3,
      description: "tissue",
      cost_price: "50",
      sell_price: "200",
      stock: "50",
    },
    {
      id: 4,
      description: "refrigerator",
      cost_price: "100000",
      sell_price: "200000",
      stock: "20",
    },
    {
      id: 5,
      description: "cellphone",
      cost_price: "50000",
      sell_price: "100000",
      stock: "30",
    },
  ]);
};
