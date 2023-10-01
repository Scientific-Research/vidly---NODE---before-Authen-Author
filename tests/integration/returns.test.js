// like always we start with Test Suits => describe()
const moment = require("moment");
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
  it("should return 200 if we have a valid request", async () => {
    // rental.dateReturned = new Date();
    // await rental.save();

    const res = await exec();

    expect(res.status).toBe(200);
  });

  // set the returnDate if input is valid
  it("should set the returnDate if input is valid!", async () => {
    const res = await exec();
    // rental.dateReturned = new Date();

    const rentalInDb = await Rental.findById(rental._id);
    console.log(rentalInDb);

    // to optimize the code and make it more specific, we have to define it more specific, therefore,
    // instead of 1 in   rental.dateReturned = 1; in return.js, we write the current date
    // but at the end there is a difference between dateReturned and current date, and we have to
    // calculate it and make sure that the diff is less than 10 seconds in the worst scenario.
    // new Date() is current date!
    const diff = new Date() - rentalInDb.dateReturned; // this gives us the difference in miliseconds
    // expect(rentalInDb.dateReturned).toBeDefined();
    expect(diff).toBeLessThan(10 * 1000); // diff less than 10 seconds!
  });

  // Calculate the rental fee (numberOfDays * movie.dailyRentalRate)
  it("should set the rentalFee if input is valid", async () => {
    // dateOut (current time) stored by mongoose in database => default: Date.now,
    // we have to make sure that this movie is borrowed by customer at least one day and not one second!
    // so, we have to change it before we call the const res = await exec();
    // for example: rental.dateOut = // 7 days ago! we can do it using moment => npm i moment
    // we use moment to get the current date and time and at the end to convert it from
    // a moment object to the plain Javascrip Object and dateOut is standard Date Object => we use the toDate();
    rental.dateOut = moment().add(-7, "days").toDate();
    console.log("7 days before: " + rental.dateOut);
    // rental.dateOut = moment().add(-7, "days")
    // console.log("7 days before without toDate(): " + rental.dateOut);

    // to save the rental on DB
    await rental.save();

    const res = await exec();
    // rental.dateReturned = new Date();

    const rentalInDb = await Rental.findById(rental._id);
    console.log(rentalInDb);

    // first we can set it to a generic thing: 7 days * 2 dollar for every day => we expect 14 dollar for 7 days.
    expect(rentalInDb.rentalFee).toBe(14);

    // or we can make it to something specific

    // to optimize the code and make it more specific, we have to define it more specific, therefore,
    // instead of 1 in   rental.dateReturned = 1; in return.js, we write the current date
    // but at the end there is a difference between dateReturned and current date, and we have to
    // calculate it and make sure that the diff is less than 10 seconds in the worst scenario.
    // new Date() is current date!
    // const diff = new Date() - rentalInDb.dateReturned; // this gives us the difference in miliseconds
    // const rentalFee = numberOfDays * movie.dailyRentalRate;
    // expect(rentalInDb.dateReturned).toBeDefined();
    // expect(diff).toBeLessThan(10 * 1000); // diff less than 10 seconds!
  });
});
