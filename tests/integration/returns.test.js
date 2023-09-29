// like always we start with Test Suits => describe()
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;

  beforeEach(() => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    const rental = new Rental({
      // two properties
      customer: {
        _Id: customerId,
        name: "12345", // name has to have at least 5 characters. minlength:5 and maxlength: 50
        phone: "12345", // phone has to have at least 5 characters. minlength:5 and maxlength: 50
      },
    });
  });

  afterEach(async () => {
    server.close();
    // await Genre.deleteMany({});
  });
});
