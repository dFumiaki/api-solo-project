const { expect, assert } = require("chai");
const config = require("../knexfile");
const knex = require("knex")(config);
const fixtures = require("./fixtures");
const customerModel = require("../src/customer/customer.model");
const CUSTOMER_TABLE = customerModel.CUSTOMER_TABLE;

describe("customer", () => {
  let customerFixture;

  before(async () => {
    customerFixture = fixtures.getCustomer();
    await knex(CUSTOMER_TABLE)
      .insert(customerFixture)
      .returning("id")
      .then((result) => {
        console.log("inserted test customer");
      })
      .catch(console.error);
  });

  after(async () => {
    await knex(CUSTOMER_TABLE)
      .where("id", customerFixture.id)
      .returning("id")
      .del()
      .then((result) => {
        console.log("removed test customer");
      })
      .catch(console.error);
  });

  describe("setup", () => {
    it("should connect to database", () => {
      knex.raw("select 1 as result").catch(() => {
        assert.fail("unable to connect to database");
      });
    });

    it("has run the initial migration", () => {
      knex(CUSTOMER_TABLE)
        .select()
        .catch(() => assert.fail("customer table is not found."));
    });
  });

  describe("getAll", () => {
    it("should return an array of customers", async () => {
      const customers = await customerModel.getAll();
      expect(customers).to.be.an.instanceof(Array);
    });

    it("should accept a limit argument", async () => {
      const customers = await customerModel.getAll(3);
      expect(customers.length).to.be.at.most(3);
    });
  });

  describe("getById", () => {
    describe("when customer exists", () => {
      it("should get customer by id", async () => {
        const customer = await customerModel.getById(customerFixture.id);
        expect(customer).to.exist;
        expect(customer.id).to.eq(customerFixture.id);
      });
    });

    describe("when customer doesn't exist", () => {
      it("should return undefined", async () => {
        const customer = await customerModel.getById(45000);
        expect(customer).to.be.undefined;
      });
    });
  });
  describe("create", () => {
    const newId = 9999;

    after(async () => {
      await knex
        .from(CUSTOMER_TABLE)
        .where("id", newId)
        .del()
        .catch(console.error);

      console.log("Deleted test product");
    });

    describe("with valid properties", () => {
      it("should be able to create a new customer", async () => {
        const newCustomer = {
          id: newId,
          email: "test@example.com",
          last_name: "Parker",
          postal_code: "55443",
        };

        const id = await customerModel.create(newCustomer);
        const customer = await knex(CUSTOMER_TABLE)
          .select()
          .where("id", newId)
          .first();
        expect(customer).to.exist;
        expect(customer.id).to.eq(newId);
      });
    });

    describe("with invalid parameters", () => {
      it("should throw an error", () => {
        assert.throws(() => {
          customerModel.create({
            bad_param: "HELLO!",
          });
        }, "Invalid field: bad_param");
      });
    });
  });

  describe("update", () => {
    describe("with valid parameters", () => {
      after(async () => {
        await knex(CUSTOMER_TABLE)
          .update({
            first_name: null,
          })
          .where("id", customerFixture.id)
          .returning("id")
          .then((result) => {
            console.log("updated test customer");
          })
          .catch(console.error);
      });

      it("should return the id", async () => {
        const id = await customerModel.update(customerFixture.id, {
          first_name: "Bill",
        });
        expect(id).to.eq(customerFixture.id);
      });

      it("should update the customer", async () => {
        const customer = await customerModel.getById(customerFixture.id);
        expect(customer.firstName).to.eq("Bill");
      });
    });

    describe("when invalid parameters", () => {
      it("shouldn't update the customer", async () => {
        assert.throws(() => {
          customerModel.update(customerFixture.id, {
            favorite_food: "Pizza",
          });
        }, "Invalid field: favorite_food");
      });
    });
  });
});
