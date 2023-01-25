const CUSTOMER_ID = 91344;

module.exports = {
  getCustomer() {
    return {
      id: CUSTOMER_ID,
      last_name: "Picard",
      email: "jeanluc2@enterprise.fed",
      postal_code: "54321",
    };
  },
  getOrder() {
    return {
      id: 11344,
      customer_id: CUSTOMER_ID,
      date_placed: "2018-9-03",
    };
  },
  getProduct() {
    return {
      id: 45555,
      description: "Moog Voyager Syntesizer",
      cost_price: 120000.0,
      sell_price: 330000.0,
      stock: 100,
    };
  },
};
