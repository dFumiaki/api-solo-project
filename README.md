# Databases II

## Table of Contents

1.  [Introduction](#introduction)
1.  [Objectives](#objectives)
1.  [Overview of Topics](#overview-of-topics)
    1.  [Knex](#knex)
    1.  [Schema](#schema)
    1.  [Migrations](#migrations)
1.  [Getting Started](#getting-started)
    1.  [Installing Dependencies and Startup](#installing-dependencies-and-startup)
1.  [Basic Requirements](#basic-requirements)
1.  [Extra Credit](#extra-credit)
1.  [Resources](#resources)
1.  [Contributing](#contributing)

## Introduction
By now you should be comfortable writing SQL queries and interacting with a database
through the command line, but how do we make this data accessible to the public?
Most people aren't interested in learning SQL or using a terminal, so it's our job
as web developers to make this data easily accessible to users through a web interface.
In this sprint you will get experience connecting a web application to a database.

## Objectives
- Be able to connect an Express server to a database
- Become familiar with using a query builder library (Knex)
  - Query database data from application code
  - Mutate database data from application code
- Re-inforce understanding of how SQL works
- Understand how a web client (HTML page), accesses data through a web server.

## Overview of Topics

### Knex
Writing raw SQL in application code is possible, but it can be a pain, and it's not very secure.
It would be better if we could write SQL in a more Javascripty way.
[Knex](http://knexjs.org/) is a library for this, and you'll be using it for this sprint.
I suggest you keep the documentation open in one tab, because you'll be reading it a lot.
In a nutshell, Knex is a Query Builder, i.e., it lets you write queries in normal Javascript
that it then converts to SQL for you.

### Schema
The database schema can be viewed here: `/docs/schema.md`. Please use this as a reference when setting up database tables.
For this sprint, you will be building a database for a shop. The database tables will hold data for customers, products, and customer orders.
A schema defines the names, data types, and constraints of our database. It also defines other database properties such as indexes and
how tables relate to each other. It's a good idea to plan and design your schema first before building a database. We've already taken care of this step for this sprint so you don't have to worry about it.

### Migrations
Whenever we change the schema of a database (add, remove, or change tables), we do so within a migration.
A migration is a set of queries that change the database in some way, and alter the data to fit within the new schema.
Migrations should _always_ happen within a transaction.
It's important to define migrations inside a transaction because we want to make sure either _all_ or _none_ of our schema changes are applied.
Knex migrations use transactions by default, so you don't have to explicitly write transactions in migration files. 

**Important**: You should _never_ delete, or edit migration files after they have been run.
If you find a mistake in your migration after it runs, then you should create a _new_ migration to update the database.


## Getting Started

### Postgres

You will need Postgres installed. If you haven't installed it already, download and install the [PostgresApp](https://postgresapp.com/) and verify it's working by running the command `psql` in your terminal.

### Installing Dependencies and Startup

To install dependencies:

```bash
    npm install
```

To run the server:

```bash
    npm start
```

Once the server is running you can open `localhost:3000` in your browser and should see a minimalist web page with a navigation bar.
You can click on the links, but you won't see any data and may get errors. That's because the web pages are trying to load data from
the database, which we haven't set up yet.

You will also want to run the tests as you write code.
To run tests:

```bash
    npm test
```

## Basic Requirements

### Setting up the database
- [ ] Create a file called `.env.local` and copy the contents of `.env.example` into this file.
  - This should not be added to the git repository!
  - [ ] Set the environment variables in this file to match your local database settings.
  - [ ] Set DB_NAME, DB_USER, and DB_PASSWORD, do not use quotes or spaces
- [ ] Create the database: `echo "CREATE DATABASE cc_store;" | psql`
  - [ ] Verify that the database exists:
    - `psql -d cc_store` (this should connect to the database without errors)

#### Building the database tables with migrations
Read about migrations in the "Overview of Topics" section above.
We created a migration file in `/db/migrations`. Look at the contents of this file to see what it's doing.
Basically it's creating a new table called `customer` and adding columns with the proper data types.
Compare this table to the schema in `docs/schema.md`. Notice that the table and column names in the migration file, matches the schema.
The data types are a little different (e.g. `varchar` vs. `string`), but this is because Knex and Postgres have their own words for the same types.
You can read more about types in the [Knex schema builder documentation](https://knexjs.org/guide/schema-builder.html#schema-building).

- [ ] Run the first migration: `npm run migrate`
  - The above command used the files in db/migrations to make changes to our database
- [ ] Verify that the migrations created the table:
  - `psql -d cc_store`
  - In PSQL session enter: `\dt`
  - You should see a list of tables including a `customer` table
- [ ] Fix the customer table. One of the columns in customer schema is missing from the table! The customer schema design has column called `city`, but it isn't in the customer table. You can see the table columns by running `\d customer` in psql.
  - [ ] **DO NOT*** edit the migration file!! Create a new migration file using the Knex CLI: `knex migrate:make update_customer_table`
  - [ ] Inside of the migration file's `up` function, write the Knex migration to add a column named `city` of type string.
    - Refer to the Knex documentation for how to add new columns.
  - [ ] Inside of the migration file's `down` function, write the reverse of the `up` operation i.e. remove the `city` column.
    - The down function executes when a Knex _rollback_ command is called which will reverse the migration.
    - Rollback should not be used on a production database since it could result in data being lost.
    - Rollback can be used in cases where a migration breaks the application and you need to temporarily go back to a stable state.
    - If a migration runs successfully, but has a mistake DON'T USE ROLLBACK. Create a new migration instead. You've been warned.
  - [ ] Run the migration: `npm run migrate`
  - [ ] Verify that the migration ran by checking the table columns with PSQL: `\d customer`
    - You should see a `city` column in the customer table
- [ ] Create migration files for the following tables using `knex migrate:make` command:
  - [ ] `product` table migration
  - [ ] `order_info` table migration
  - [ ] `order_product` table migration
- [ ] Fill in the `up` and `down` functions in each generated migration file. 
    - Use the schema in `/docs/schema.md` and Knex schema builder documentation for reference.
    - Make sure that the foreign key references between tables are defined (e.g. `order_info.customer_id` references `customer.id`):
- [ ] Run the migrations: `npm run migrate`
- [ ] Verify that the migrations ran by checking the table columns with PSQL: `\dt`

#### Filling the database with starting data using seeds
Right now your database should have tables, but they are all empty. Try running a select query on one of them (e.g. `SELECT * FROM customer;`).
To get some test data into our local database, we can use a script that will insert some initial data rows. This script is called a _seed_ file.
We've created a seed file for you in the `db/seeds` directory. Take a quick look at it to get an idea of what it's doing.
Basically it just inserts a few rows of data into the customer table.
You can read more about seeds in the [Knex documentation](https://knexjs.org/guide/migrations.html#seed-cli)

- [ ] Run the seed script by running `npm run seed`
- [ ] Verify that the seed runs without error and check the customer table in the database by running a query: `SELECT * FROM customer;`
  - Now you should see some results.
- [ ] Write your own seed scripts to add data to the other tables:
  **NOTE** Since some tables include foreign keys (customer reference), you need to make sure that you insert a value that matches an existing id in the foreign table (e.g. `order_product.product_id` must reference an id that exists in the `product` table.
  - [ ] Seed the `product` table
    - [ ] Generate a seed script with Knex CLI: `knex seed:make 002-products`
      - The above command with create a new file called `002-products.js` in the `db/seeds` directory
      - We prefixed the seed name with `002` because knex runs seeds in alphabetical order by default.
        This naming scheme is optional, but it allows us to control the order in which seeds run.
      - Seeds are just scripts. They aren't tracked like migrations.
    - [ ] Fill in the seed script file with data to insert. Use the `001-customers.js` file as an example to guide you
    - [ ] Successfully run the seed command `npm run seed`
  - [ ] Seed the `order_info` table
    - [ ] Generate a seed script with Knex CLI: `knex seed:make 003-orders`
    - [ ] Fill in the seed script file with data to insert
    - [ ] Successfully run the seed command `npm run seed`
  - [ ] Seed the `order_product` table
    - [ ] Generate a seed script with Knex CLI: `knex seed:make 004-order_products`
    - [ ] Fill in the seed script file with data to insert
    - [ ] Successfully run the seed command `npm run seed`

Your local database should be set up and include some table rows now.
- [ ] Verify that the data is there by running some queries in PSQL:
  - [ ] `SELECT * FROM product;`
  - [ ] `SELECT count(id) FROM order_info;`
  - [ ] `SELECT last_name from customer WHERE id = 1;`
  - [ ] `SELECT * FROM order_product JOIN product ON product.id = order_product.product_id;`

**Requirements continue below**

### Connecting data with Knex Query Builder
Now that you have your database set up, the next step is to connect it to the Express server code.
The Express code that maps URLs to functions has already been written. You can view the routes in the src/server.js file. Each route uses a request handler function from a _controller_ module.
The controller is responsible for getting the data from a _model_ module and rendering it as a page or _view_.
The _model_ is responsible for database interactions (i.e. create, retreive, update, delete).
This is a basic [Model View Controller (MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern.

Your task is to fill in the model functions in with Knex queries. You can find the model modules in the files with a `*.model.js` suffix.
Take a look at `getAll` and `getById` functions in `src/customer/customer.model.js` to get
an idea of how Knex is being used to get data from the database. These functions are using Knex to grab records (i.e. rows) from the Postgres database, and returning them as Javascript data structures.

You will be need to use [Knex query builder](https://knexjs.org/guide/query-builder.html).
There are JSDOC comments that hint at the input (@param) and output (@return).

Knex is convenient because it handles the connection to the database and writes SQL queries for us.
The `knexfile.js` is where Knex gets the database connection details.
Without Knex we would have to write some sort of script to handle the connection.
We'd also have to write a lot of raw SQL queries (e.g. `SELECT * FROM ...`) which are tedious,
can lead to errors, and could potentially introduce security vulberabilities (e.g. SQL injection).

Remember to refer to the documentation if you get stuck, or are not sure what Knex methods are available.

Implement the following functions in the model files using Knex query builder. All tests should pass:
- [ ] Customers (`src/customer/customer.model.js`)
  - [ ] create
  - [ ] update
- [ ] Products (`src/product/product.model.js`)
  - [ ] getAll
    - The query result should be an array of objects with the following properties:
      - id
      - description
      - costPrice
      - sellPrice
  - [ ] getById
    - The query result should be an object with the following properties:
      - description
      - costPrice
      - sellPrice
  - [ ] create
  - [ ] update
- [ ] Orders (`src/order/order.model.js`)
  - [ ] getAll
    - [ ] The query result should be an array of order objects with the following properties:
      - id
      - customerId
      - datePlaced
      - dateShipped
  - [ ] getById
    - [ ] The query result should be a single object with the following properties:
      - datePlaced
      - dateShipped
      - customerLast
      - customerFirst
      - customerId
      - customerCountry
      - items
    - [ ] Each product in the `items` array should include:
      - [ ] productDescription
      - [ ] productPrice
      - [ ] quantity
    - You will need to join data from customer and order_product to build the result object.
  - [ ] create
    - You will need to include the customer_id for each order. You will have to use a customer that exists in the customer table for this to work.
  - [ ] update

### Extra Credit
- [ ] Add a list of order items to the order object returned from Order.getById
- [ ] Add model functions that return filtered results by search parameters
  - [ ] Filter customers by location
  - [ ] Filter products by stock, cost_price, sell_price
  - [ ] Filter orders by customer_id
- [ ] Write some tests for the fitering functions
- [ ] Cache query results to reduce unnecessary database queries

## Resources

- [Knex Documentation](http://knexjs.org/)
