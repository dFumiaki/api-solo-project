const { expect, assert } = require("chai");
const config = require("../knexfile");
const knex = require("knex")(config);

const fixtures = require("./fixtures");
const productModel = require("../src/product/product.model");
const PRODUCT_TABLE = productModel.PRODUCT_TABLE;

describe("product", () => {
  const productFixture = fixtures.getProduct();

  describe("setup", () => {
    it("should connect to database", () => {
      knex.raw("select 1 as result").catch(() => {
        assert.fail("unable to connect to database");
      });
    });

    it("has run the initial migration", () => {
      knex(PRODUCT_TABLE)
        .select()
        .catch(() => assert.fail("product table is not found."));
    });
  });

  describe("getAll", () => {
    it("should return an array of products", async () => {
      const products = await productModel.getAll();
      expect(products).to.be.an.instanceof(Array);
    });

    it("should accept a limit argument", async () => {
      const products = await productModel.getAll(3);
      expect(products.length).to.be.at.most(3);
    });
  });

  describe("getById", () => {
    before(async () => {
      await knex(PRODUCT_TABLE).insert(productFixture);
    });
    after(async () => {
      await knex(PRODUCT_TABLE)
        .where("id", productFixture.id)
        .del()
        .catch(console.error);
    });

    describe("when valid request parameter", () => {
      it("should get product by id", async () => {
        const product = await productModel.getById(productFixture.id);
        expect(product).to.exist;
        expect(product.id).to.eq(productFixture.id);
      });
    });
  });

  describe("create", () => {
    const newId = 9999;

    after(async () => {
      await knex
        .from(PRODUCT_TABLE)
        .where("id", newId)
        .del()
        .catch(console.error);

      console.log("Deleted test product");
    });

    describe("with valid properties", () => {
      it("should be able to create a new product", async () => {
        const newProduct = {
          id: newId,
          description: "This is a new test product",
          cost_price: 49.99,
          sell_price: 149.99,
          stock: 100,
        };

        const id = await productModel.create(newProduct);
        const product = await knex(PRODUCT_TABLE)
          .select()
          .where("id", newId)
          .first();
        expect(product).to.exist;
        expect(product.id).to.eq(newId);
      });
    });

    describe("with invalid parameters", () => {
      it("should throw an error", () => {
        assert.throws(() => {
          productModel.create({
            bad_param: "HELLO!",
          });
        }, "Invalid field: bad_param");
      });
    });
  });

  describe("update", () => {
    before(async () => {
      await knex(PRODUCT_TABLE).insert(productFixture);
    });
    after(async () => {
      await knex(PRODUCT_TABLE)
        .where("id", productFixture.id)
        .del()
        .catch(console.error);
    });

    it("should return the id", async () => {
      const id = await productModel.update(productFixture.id, {
        description: "A new and improved description",
      });
      expect(id).to.eq(productFixture.id);
    });

    it("should update the product", async () => {
      const product = await productModel.getById(productFixture.id);
      expect(product.description).to.eq("A new and improved description");
    });
  });
});
