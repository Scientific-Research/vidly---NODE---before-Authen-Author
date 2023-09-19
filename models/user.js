const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");
// const { genreSchema } = require("./genre");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      password: this.password,
    },
    // "jwtPrivateKey"
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    // genreId: Joi.objectId().required(),
    email: Joi.string().min(5).max(255).required().email(),
    // email: Joi.string().email({
    //   minDomainSegments: 2,
    //   tlds: { allow: ["com", "net"] },
    // }),
    password: Joi.string().min(5).max(255).required(),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
