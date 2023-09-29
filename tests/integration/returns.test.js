// like always we start with Test Suits => describe()
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");

const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;

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
    await Rental.remove({});
  });

  // and now let us to test it using a simple test:
  items("should work", async () => {
    // at this test, i simply take a look at the database, whether this rental is there or not? if is it there
    // it means our setup code is working:
    const result = await Rental.findById(rental._Id);
    expect(result).not.toBeNull();
  });
});
