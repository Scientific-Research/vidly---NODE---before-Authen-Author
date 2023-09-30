// like always we start with Test Suits => describe()
const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");

const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  let token;
  //   let name;

  // defining the happy path from MH:
  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      //   .send({ customerId: customerId, movieId: movieId });
      // both the key and value are the same, therfore, we can write only one of them.
      .send({ customerId: customerId, movieId: movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      // two properties
      customer: {
        _id: customerId,
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
    // await Genre.deleteMany({});
    // and finally we have to clean up in the afterEach() as following:
    // await Rental.remove({});
    await Rental.deleteMany({});
    await server.close();
  });

  // and now let us to test it using a simple test:
  it("should work", async () => {
    // at this test, i simply take a look at the database, whether this rental is there or not? if is it there
    // it means our setup code is working:
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
    console.log(result);
  });

  // Return 401 if client is not logged in!
  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  // return 400 if customerId is not provided!
  it("should return 400 if customerId is not provided", async () => {
    // token = "";
    // const token = new User().generateAuthToken();
    customerId = "";
    // or
    // delete payload.customerId;
    const res = await exec();

    expect(res.status).toBe(400);
  });

  // return 400 if movieId is not provided!
  it("should return 400 if movieId is not provided", async () => {
    // token = "";
    // const token = new User().generateAuthToken();
    // token = new User().generateAuthToken();
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 404 if no rental found for this customer/movie
  it("should return 404 if no rental found for this customer/movie", async () => {
    // customerId = mongoose.Types.ObjectId();
    // movieId = mongoose.Types.ObjectId();

    // first of all,we have to clean the rental collection:
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  // Return 400 if return is already processed!
  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  // Return 200 if valid request
  it("should return 200 if valid request", async () => {
    // rental.dateReturned = new Date();
    // await rental.save();

    const res = await exec();

    expect(res.status).toBe(200);
  });
});
