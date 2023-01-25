const orderModel = require("./order.model");

module.exports = {
  async index(req, res) {
    const orders = await orderModel.getAll();
    res.render("pages/orders/index", {
      orders,
    });
  },

  async view(req, res) {
    const id = parseInt(req.params.id);
    const order = await orderModel.getById(id);
    res.render("pages/orders/view", {
      order,
    });
  },

  new(req, res) {
    res.render("pages/orders/new", {
      order: {},
      buttonText: "Add Order",
    });
  },

  async save(req, res) {
    const { id, customerId, datePlaced, dateShipped } = req.body;

    const payload = {
      customer_id: customerId,
      date_placed: datePlaced,
      date_shipped: dateShipped,
    };

    id
      ? await orderModel.update(id, payload)
      : await orderModel.create(payload);

    res.redirect("/orders");
  },

  async edit(req, res) {
    const id = parseInt(req.params.id);
    const order = await orderModel.getById(id);
    res.render("pages/orders/edit", {
      order,
      buttonText: "Update order",
    });
  },
};
