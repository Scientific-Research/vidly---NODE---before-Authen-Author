// const MongoClient  = require("mongodb").MongoClient;
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();

require("./startup/loggin")();
require("./startup/routes")(app);
require("./startup/db")(); // call the db.js inside the index.js

// const url = "mongodb://127.0.0.1/vidly";
// const client = new MongoClient(url, { useUnifiedTopology: true });
// client.connect();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
