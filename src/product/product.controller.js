const productModel = require("./product.model");

module.exports = {
  async index(req, res) {
    const products = await productModel.getAll();
    res.render("pages/products/index", {
      products,
    });
  },

  async view(req, res) {
    const id = parseInt(req.params.id);
    const product = await productModel.getById(id);
    res.render(
      "pages/products/view",
      {
        product,
      },
      (err, html) => {
        if (err) {
          res.status(500).redirect("/error");
        } else {
          res.send(html);
        }
      }
    );
  },

  new(req, res) {
    res.render("pages/products/new", {
      product: {},
      buttonText: "Add product",
    });
  },

  async save(req, res) {
    const { id, description, costPrice, sellPrice, stock } = req.body;

    const payload = {
      description,
      cost_price: costPrice,
      sell_price: sellPrice,
      stock,
    };

    id
      ? await productModel.update(id, payload)
      : await productModel.create(payload);

    res.redirect("/products");
  },

  async edit(req, res) {
    const id = parseInt(req.params.id);
    const product = await productModel.getById(id);
    res.render("pages/products/edit", {
      product,
      buttonText: "Update product",
    });
  },
};
