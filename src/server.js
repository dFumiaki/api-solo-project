const express = require("express");
const path = require("path");

const customerController = require("./customer/customer.controller");
const productController = require("./product/product.controller");
const orderController = require("./order/order.controller");

const app = express();

/*
  This adds JSON parsing middleware for incoming request
  body with a Content-Type header of 'application/json'.
  You don't need to worry about JSON.parse or JSON.stringify
  when this middleware is used.
*/
app.use(express.json());

// For parsing form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// This configures templates for the frontend of the app.
app.set("views", `${__dirname}/templates`);
app.set("view engine", "ejs");

/*
  This allows us to serve static files (html, css, etc.) from
  the public directory.
*/
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.render("pages/index");
});

const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (id) {
    next();
  } else {
    res
      .status(400)
      .send(
        "Invalid id parameter. Expecting number, received " +
          typeof req.params.id
      );
  }
};

// Customer routes
app.get("/customers", customerController.index);
app.get("/customers/view/:id", validateId, customerController.view);
app.get("/customers/edit/:id", validateId, customerController.edit);
app.get("/customers/new", customerController.new);
app.post("/customers/save", customerController.save);

// product routes
app.get("/products", productController.index);
app.get("/products/view/:id", validateId, productController.view);
app.get("/products/edit/:id", validateId, productController.edit);
app.get("/products/new", productController.new);
app.post("/products/save", productController.save);

// Order routes
app.get("/orders", orderController.index);
app.get("/orders/view/:id", validateId, orderController.view);
app.get("/orders/edit/:id", validateId, orderController.edit);
app.get("/orders/new", orderController.new);
app.post("/orders/save", orderController.save);

app.get("/error", (req, res) => {
  res.render("pages/error");
});
