const express = require("express");
const path = require("path");
const idController = require("./id/id.controller");

const setupServer = () => {
  const app = express();
  app.use(express.json());

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

  // ID routes
  app.get("/pokemons", idController.index);
  app.get("/pokemons/view/:id", validateId, idController.view);
  //app.get("/pokemons/edit/:id", validateId, idController.edit);
  //app.get("/pokemons/new", idController.new);
  app.post("/pokemons/save", idController.save);
  app.patch("/pokemons/update/:id", idController.update);
  app.delete("/pokemons/delete/:id", idController.delete);

  return app;
};

module.exports = { setupServer };
