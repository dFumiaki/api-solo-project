/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("customer").del();
  await knex("customer").insert([
    {
      id: 1,
      email: "fenxen@example.com",
      first_name: "Henry",
      last_name: "Krinkle",
      address: "154 Hopper ave.",
      city: "Fairmont",
      region: "New Jersey",
      postal_code: "60245",
      country: "United States",
    },
    {
      id: 2,
      email: "burgerham213@example.com",
      first_name: "Pascal",
      last_name: "Buress",
      address: "2031 Grace ave.",
      city: "Milwaukee",
      region: "Wisconsin",
      postal_code: "53201",
      country: "United States",
    },
    {
      id: 3,
      email: "sol655@example.com",
      first_name: "Kris",
      last_name: "Kelvin",
      address: "Школьная улица, 83А",
      city: "Lesnoye",
      region: "Astrahanskaya",
      postal_code: "416425",
      country: "Russia",
    },
    {
      id: 4,
      email: "darkstar9@example.com",
      first_name: "Dan",
      last_name: "O'Bannon",
      address: "784 Talby blvd.",
      city: "Ann Arbor",
      region: "Michigan",
      postal_code: "48234",
      country: "United States",
    },
    {
      id: 5,
      email: "carfan640@example.com",
      first_name: "Mike",
      last_name: "Halford",
      address: "3112 Oak st.",
      city: "Miami",
      region: "Florida",
      postal_code: "80245",
      country: "United States",
    },
  ]);
};
