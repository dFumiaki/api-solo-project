const knex = require("../knex");

const { validProps, requiredProps } = require("../util/validation");

const validateProps = validProps([
  "id",
  "description",
  "cost_price",
  "sell_price",
  "stock",
]);

const validateRequired = requiredProps(["description", "stock"]);

const PRODUCT_TABLE = "product";

module.exports = {
  PRODUCT_TABLE,

  /**
   * Get all products.
   * @param {number} limit - The max number of records to return.
   * @return {Promise<Array>} A promise that resolves to an array products.
   */
  getAll(limit = 100) {
    // YOUR CODE HERE
    return knex
      .select({
        id: "id",
        description: "description",
        costPrice: "cost_price",
        sellPrice: "sell_price",
        stock: "stock",
      })
      .from(PRODUCT_TABLE)
      .limit(limit);
  },

  /**
   * Get a single product by id.
   * @param {number} id - The product's id.
   * @return {Promise<Object>} A promise that resolves to the product that matches the id.
   */
  getById(id) {
    // YOUR CODE HERE
    return knex
      .select({
        id: "id",
        description: "description",
        costPrice: "cost_price",
        sellPrice: "sell_price",
        stock: "stock",
      })
      .from(PRODUCT_TABLE)
      .where({
        id: id,
      })
      .first();
  },

  /**
   * Create a new product.
   * @param {Object} product - The new product to add.
   * @return {Promise<number>} A promise that resolves to the id of the created product.
   */
  create(product) {
    validateRequired(validateProps(product));

    // YOUR CODE HERE
    return knex.insert(product).into(PRODUCT_TABLE);
  },

  /**
   * Update an existing product.
   * @param {number} id - The unique id of the existing product.
   * @param {Object} product - The product data to change.
   * @return {Promise<number>} A promise that resolves to the id of the updated product
   */
  update(id, product) {
    validateProps(product);

    // YOUR CODE HERE
    return knex(PRODUCT_TABLE)
      .update(product, ["id"])
      .where({ id: id })
      .then((results) => results[0].id);
  },
};
