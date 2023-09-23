const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(config.get("db"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    // .then(() => console.log("Connected to MongoDB..."))
    .then(() => winston.info("Connected to MongoDB..."));

  // .catch((err) => console.error("Could not connect to MongoDB..."));
};
