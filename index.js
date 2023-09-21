const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();

require("./startup/loggin")();
require("./startup/routes")(app);
require("./startup/db")(); // call the db.js inside the index.js
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
