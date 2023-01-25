const { expect, assert } = require("chai");
const config = require("../knexfile");
const knex = require("knex")(config);

const fixtures = require("./fixtures");
const { CUSTOMER_TABLE } = require("../src/customer/customer.model");
const orderModel = require("../src/order/order.model");
const ORDER_TABLE = orderModel.ORDER_TABLE;

describe("order", () => {
  const customerFixture = fixtures.getCustomer();
  const orderFixture = fixtures.getOrder();

  let order;

  before(async () => {
    await knex(CUSTOMER_TABLE).insert(customerFixture);
    await knex(ORDER_TABLE).insert(orderFixture);
  });

  after(async () => {
    await knex
      .from(ORDER_TABLE)
      .where("id", orderFixture.id)
      .del()
      .catch((error) => console.error(error));

    await knex
      .from(CUSTOMER_TABLE)
      .where("id", customerFixture.id)
      .del()
      .catch((error) => console.error(error));
  });

  describe("setup", () => {
    it("should connect to database", () => {
      knex.raw("select 1 as result").catch(() => {
        assert.fail("unable to connect to database");
      });
    });

    it("has run the initial migration", () => {
      knex(ORDER_TABLE)
        .select()
        .catch(() => assert.fail("order table is not found."));
    });
  });

  describe("getAll", () => {
    it("should return an array of orders", async () => {
      const orders = await orderModel.getAll();
      expect(orders).to.be.an.instanceof(Array);
    });

    it("should accept a limit argument", async () => {
      const orders = await orderModel.getAll(3);
      expect(orders.length).to.be.at.most(3);
    });
  });

  describe("getById", () => {
    describe("when valid request parameter", () => {
      it("should get order by id", async () => {
        const order = await orderModel.getById(orderFixture.id);
        expect(order).to.exist;
        expect(order.id).to.eq(orderFixture.id);
      });
    });
  });

  describe("create", () => {
    const newId = 9999;

    after(async () => {
      await knex
        .from(ORDER_TABLE)
        .where("id", newId)
        .del()
        .catch(console.error);

      console.log("Deleted test order");
    });

    describe("with valid properties", () => {
      it("should be able to create a new order", async () => {
        const newOrder = {
          id: newId,
          customer_id: customerFixture.id,
          date_placed: new Date(),
        };

        await orderModel.create(newOrder);
        const order = await knex(ORDER_TABLE)
          .select()
          .where("id", newId)
          .first();
        expect(order).to.exist;
        expect(order.id).to.eq(newId);
      });
    });

    describe("with invalid parameters", () => {
      it("should throw an error", () => {
        assert.throws(() => {
          orderModel.create({
            customer_id: customerFixture.id,
            bad_param: "HELLO!",
          });
        }, "Invalid field: bad_param");
      });
    });
  });

  describe("update", () => {
    let shipDate = new Date();

    it("should return the id", async () => {
      const id = await orderModel.update(orderFixture.id, {
        date_shipped: shipDate,
      });
      expect(id).to.eq(orderFixture.id);
    });

    it("should update the order", async () => {
      const order = await orderModel.getById(orderFixture.id);
      expect(order.dateShipped.toLocaleDateString()).to.eq(
        shipDate.toLocaleDateString()
      );
    });
  });
});
