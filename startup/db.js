const mongoose = require("mongoose");
const winston = require("winston");
// const MongoClient = require("mongodb").MongoClient;

mongoose.set("strictQuery", false);

module.exports = function () {
  // const client = new MongoClient("mongodb://127.0.0.1/vidly", {
  //   useUnifiedTopology: true,
  // });
  mongoose
    .connect("mongodb://127.0.0.1/vidly", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    // .then(() => console.log("Connected to MongoDB..."))
    .then(() => winston.info("Connected to MongoDB..."));

  // .catch((err) => console.error("Could not connect to MongoDB..."));
};
