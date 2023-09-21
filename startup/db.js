const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect("mongodb://127.0.0.1/vidly", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    // .then(() => console.log("Connected to MongoDB..."))
    .then(() => winston.info("Connected to MongoDB..."));

  // .catch((err) => console.error("Could not connect to MongoDB..."));
};
