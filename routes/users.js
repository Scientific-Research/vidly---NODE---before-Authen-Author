const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();

  res.send(user);
});

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Genre.findById(req.body.genreId);
//   if (!genre) return res.status(400).send("Invalid genre.");

//   const movie = await Movie.findByIdAndUpdate(
//     req.params.id,
//     {
//       title: req.body.title,
//       genre: {
//         _id: genre._id,
//         name: genre.name,
//       },
//       numberInStock: req.body.numberInStock,
//       dailyRentalRate: req.body.dailyRentalRate,
//     },
//     { new: true }
//   );

//   if (!movie)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(movie);
// });

// router.delete("/:id", async (req, res) => {
//   const movie = await Movie.findByIdAndRemove(req.params.id);

//   if (!movie)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(movie);
// });

// router.get("/:id", async (req, res) => {
//   const movie = await Movie.findById(req.params.id);

//   if (!movie)
//     return res.status(404).send("The movie with the given ID was not found.");

//   res.send(movie);
// });

module.exports = router;
