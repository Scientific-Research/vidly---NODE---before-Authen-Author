require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  // process.on("uncaughtException", (ex) => {
  //   // console.log("WE GOT AN UNCAUGHT EXCEPTION");
  //   winston.error(ex.message, ex);
  //   process.exit(1); // zero means success, anything else: Failure
  // });

  // is the same like above but from winston
  // winston.handleExceptions( // this is deprecated in Winston@4
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  // Update MongoClient configuration
  // const client = new MongoClient("mongodb://127.0.0.1/vidly", {
  //   useUnifiedTopology: true,
  // });

  process.on("unhandledRejection", (ex) => {
    // console.log("WE GOT AN UNHANDLED REJECTION");
    // winston.error(ex.message, ex);
    // process.exit(1); // it would be better to exit the node process when we have an error!
    throw ex;
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

  // Error simulation for UNCAUGHT EXCEPTION
  //throw new Error("Something failed during startup!");

  // Error simulation for UNHANDLED REJECTION
  // const p = Promise.reject(new Error("Something failed miserably!"));
  // p.then(() => console.log("Done"));
};
