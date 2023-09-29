// like always we start with Test Suits => describe()
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");

const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;

  beforeEach(() => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    const rental = new Rental({
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
  });

  afterEach(async () => {
    server.close();
    // await Genre.deleteMany({});
  });
});
