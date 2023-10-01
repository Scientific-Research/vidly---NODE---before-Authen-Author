const moment = require("moment");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
// const { Customer } = require("../models/customer");

// app.post("/api/returns",async(req,res)=>{})
router.post("/", auth, async (req, res) => {
  //   const customer = await Customer.findById(req.body.customerId);
  //   if (!customer) return res.status(400).send("Invalid customer.");

  if (!req.body.customerId)
    return res.status(400).send("customerId not provided!");
  if (!req.body.movieId) return res.status(400).send("movieId not provided!");

  // first of all, we have to find the rental for this movieId and customerId:
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    // customerId: req.body.customerId,
    // customer._id: req.body.customerId,
    "movie._id": req.body.movieId,
    // movieId: req.body.movieId,
    // movie._id: req.body.movieId,
  });

  //   let user = await User.findOne({ email: req.body.email });

  if (!rental)
    return res
      .status(404)
      .send("The rental with the given customerId and movieId was not found.");

  // Return 400 if return is already processed!
  if (rental.dateReturned)
    return res.status(400).send("Return already processed!");

  // set the returnDate if input is valid
  //   rental.dateReturned = 1;
  // instead of 1, we write the current date
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  // Calculate the rental fee (numberOfDays * movie.dailyRentalRate)
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  // we use the update first approach instead of query first approach to update the number of stock:
  const movie = await Movie.updateMany(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  // Return 200 if valid request
  if (rental) return res.status(200).send("the request is valid!");

  //  return res.status(401).send("Unauthorized User!");
});

module.exports = router;
