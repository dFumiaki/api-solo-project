/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("order_info").del();
  await knex("order_info").insert([
    {
      id: 1,
      customer_id: "1",
      date_placed: "2023-02-14",
      date_shipped: "2023-03-01",
    },
    {
      id: 2,
      customer_id: "2",
      date_placed: "2023-02-15",
      date_shipped: "2023-03-02",
    },
    {
      id: 3,
      customer_id: "1",
      date_placed: "2023-02-20",
      date_shipped: "2023-03-03",
    },
    {
      id: 4,
      customer_id: "3",
      date_placed: "2023-03-1",
      date_shipped: "2023-03-04",
    },
    {
      id: 5,
      customer_id: "5",
      date_placed: "2023-03-2",
      date_shipped: "2023-03-05",
    },
  ]);
};
