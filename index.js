const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/loggin")();
require("./startup/routes")(app);
require("./startup/db")(); // call the db.js inside the index.js
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
