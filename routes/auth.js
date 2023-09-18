const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
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

  // test if the User is correct?
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  // test if the password is correct?
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    "jwtPrivateKey"
  );
  // res.send(true);
  res.send(token);

  // using lodash to avoid repeating the req.body again and again and again as below:
  // user = new User(_.pick(req.body, ["name", "email", "password"]));
  // const salt = await bcrypt.genSalt(10);
  // //   const hashed = await bcrypt.hash("1234", salt);
  // user.password = await bcrypt.hash(user.password, salt);

  // //   user = new User({
  // //     name: req.body.name,
  // //     email: req.body.email,
  // //     password: req.body.password,
  // //   });

  // await user.save();

  //   res.send(user);
  // res.send(_.pick(user, ["_id", "name", "email"])); // showing only name and email to user and not passowrd using lodash
  // and we don't need to repeat req.body again and again.
  //   res.send({
  //     name: user.name,
  //     email: user.email,
  //     // password: req.body.password,
  //   });
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

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    // name: Joi.string().min(5).max(50).required(),
    // genreId: Joi.objectId().required(),
    // email: Joi.string().email({
    //   minDomainSegments: 2,
    //   tlds: { allow: ["com", "net"] },
    // }),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  };

  return Joi.validate(req, schema);
}
module.exports = router;
