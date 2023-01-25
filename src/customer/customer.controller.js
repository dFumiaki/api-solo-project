const customerModel = require("./customer.model");

module.exports = {
  async index(req, res) {
    const customers = await customerModel.getAll();
    res.render("pages/customers/index", {
      customers,
    });
  },

  async view(req, res) {
    const id = parseInt(req.params.id);
    const customer = await customerModel.getById(id);
    res.render("pages/customers/view", {
      customer,
    });
  },

  new(req, res) {
    res.render("pages/customers/new", {
      customer: {},
      buttonText: "Add Customer",
    });
  },

  async save(req, res) {
    const {
      id,
      firstName,
      lastName,
      email,
      address,
      city,
      region,
      country,
      postalCode,
    } = req.body;

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      address,
      city,
      region,
      country,
      postal_code: postalCode,
    };

    let customer;

    if (id) {
      customer = await customerModel.update(id, payload);
    } else {
      customer = await customerModel.create(payload);
    }
    res.redirect("/customers");
  },

  async edit(req, res) {
    const id = parseInt(req.params.id);
    const customer = await customerModel.getById(id);
    res.render("pages/customers/edit", {
      customer,
      buttonText: "Update Customer",
    });
  },
};
