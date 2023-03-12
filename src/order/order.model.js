const knex = require("../knex");

const { validProps, requiredProps } = require("../util/validation");

const validateProps = validProps([
  "id",
  "customer_id",
  "date_placed",
  "date_shipped",
]);

const validateRequired = requiredProps(["customer_id", "date_placed"]);

const ORDER_TABLE = "order_info";

module.exports = {
  ORDER_TABLE,

  /**
   * Get all orders.
   * @param {number} limit - The max number of records to return.
   * @return {Promise<Array>} A promise that resolves to an array of orders.
   */
  getAll(limit = 100) {
    // YOUR CODE HERE
    return knex
      .select({
        id: "id",
        customerID: "customer_id",
        datePlaced: "date_placed",
        dateShipped: "date_shipped",
      })
      .from(ORDER_TABLE)
      .limit(limit);
  },

  /**
   * Get a single order by id.
   * @param {number} id - The order's id.
   * @return {Promise<Object>} A promise that resolves to the order that matches the id.
   */
  getById(id) {
    // YOUR CODE HERE
    return knex
      .select({
        id: "id",
        customerID: "customer_id",
        datePlaced: "date_placed",
        dateShipped: "date_shipped",
      })
      .from(ORDER_TABLE)
      .where({ id: id })
      .first();
  },

  /**
   * Create a new order.
   * @param {Object} order - The new order data to add.
   * @return {Promise<number>} A promise that resolves to the order that was created.
   */
  create(order) {
    validateRequired(validateProps(order));

    // YOUR CODE HERE
    return knex(ORDER_TABLE).insert(order);
  },

  /**
   * Update an existing order.
   * @param {number} id - The unique id of the existing order.
   * @param {Object} order - The order data to change.
   * @return {Promise<number>} A promise that resolves to the id of the updated order
   */
  update(id, order) {
    validateProps(order);

    // YOUR CODE HERE
    return knex(ORDER_TABLE)
      .update(order, ["id"])
      .where({ id: id })
      .then((results) => results[0].id);
  },
};
