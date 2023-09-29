// like always we start with Test Suits => describe()
const request = require("supertest");
const { Rental } = require("../../models/rental");

const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  let token;
  let name;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
    //   .set("x-auth-token", token)
      //   .send({ customerId: customerId, movieId: movieId });
      // both the key and value are the same, therfore, we can write only one of them.
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      // two properties
      customer: {
        _Id: customerId,
        name: "12345", // name has to have at least 5 characters. minlength:5 and maxlength: 50
        phone: "12345", // phone has to have at least 5 characters. minlength:5 and maxlength: 50
      },
      movie: {
        _id: movieId,
        title: "movie_title", // title has to have at least 5 characters. minlength:5 and maxlength: 50
        dailyRentalRate: 2,
      },
    });

    // Save our rental object to the DataBase!
    await rental.save();
  });

  afterEach(async () => {
    server.close();
    // await Genre.deleteMany({});
    // and finally we have to clean up in the afterEach() as following:
    // await Rental.remove({});
    await Rental.deleteMany({});
  });

  // and now let us to test it using a simple test:
  it("should work", async () => {
    // at this test, i simply take a look at the database, whether this rental is there or not? if is it there
    // it means our setup code is working:
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
    console.log(result);
  });

  it("should return 401 if client is not logged in", async () => {
    // token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });
});
