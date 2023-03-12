const knex = require("../knex");
const { validProps, requiredProps } = require("../util/validation");

const validateProps = validProps([
  "id",
  "email",
  "first_name",
  "last_name",
  "address",
  "city",
  "region",
  "country",
  "postal_code",
]);

const validateRequired = requiredProps(["email", "last_name", "postal_code"]);

const CUSTOMER_TABLE = "customer";

module.exports = {
  CUSTOMER_TABLE,

  /**
   * @param {number} limit - The max number of customers to return.
   * @return {Promise<Array>} A promise that resolves to an array of customers.
   */
  getAll(limit = 100) {
    return knex
      .select({
        id: "id",
        lastName: "last_name",
        firstName: "first_name",
        country: "country",
      })
      .from(CUSTOMER_TABLE)
      .limit(limit);
  },

  /**
   * @param {number} id - The customer's id.
   * @return {Promise<Object>} A promise that resolves to the customer that matches the id.
   */
  getById(id) {
    return knex
      .select({
        id: "id",
        lastName: "last_name",
        firstName: "first_name",
        email: "email",
        address: "address",
        city: "city",
        region: "region",
        postalCode: "postal_code",
        country: "country",
      })
      .from(CUSTOMER_TABLE)
      .where({
        id: id,
      })
      .first();
  },

  /**
   * @param {Object} customer - The new customer data to add.
   * @return {Promise<number>} A promise that resolves to the id of created customer.
   */
  create(customer) {
    validateRequired(validateProps(customer));
    // YOUR CODE HERE
    return knex.insert(customer).into(CUSTOMER_TABLE);
  },

  /**
   * @param {number} id - The unique id of the existing customer.
   * @param {Object} customer - The customer data to change.
   * @return {Promise<number>} A promise that resolves to the id of the updated customer.
   */
  update(id, customer) {
    validateProps(customer);

    // YOUR CODE HERE
    return knex(CUSTOMER_TABLE)
      .update(customer, ["id"])
      .where({ id: id })
      .then((results) => results[0].id);
  },
};
