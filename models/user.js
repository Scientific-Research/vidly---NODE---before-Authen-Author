const Joi = require("joi");
const mongoose = require("mongoose");
// const { genreSchema } = require("./genre");

const User = mongoose.model(
  "Users",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    // genreId: Joi.objectId().required(),
    // email: Joi.string().required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    // password: Joi.string().min(6).required(),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
