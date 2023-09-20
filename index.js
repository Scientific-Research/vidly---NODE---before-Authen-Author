require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
// const MongoClient = require("mongodb").MongoClient;
const error = require("./middleware/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
});
// Add a console transport
// winston.add(new winston.transports.Console());

// Add a console transport
winston.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `timestamp: ${info.timestamp}, level: ${info.level}, message: ${info.message}`;
      })
    ),
  })
);

// // Add a file transport
// winston.add(new winston.transports.File({ filename: "logfile.log" }));

// Add a file transport with a custom format
winston.add(
  new winston.transports.File({
    filename: "logfile.log",
    format: winston.format.combine(
      // winston.format.colorize({ all: true }),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `timestamp: ${info.timestamp}, level: ${info.level}, message: ${info.message}`;
      })
    ),
  })
);

// Add a file transport to MongoDB => to log messages to a MongoDB datbase.
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://127.0.0.1/vidly",
    // level: "error",
    level: "info", // this lines publishes error,warn and info in log Document in MongoDB Compass
  })
);

throw new Error("Something failed during startup!");
// const url = "mongodb://127.0.0.1/vidly";
// const client = new MongoClient(url, { useUnifiedTopology: true });
// client.connect();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined!");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
