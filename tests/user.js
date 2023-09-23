const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

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
  isAdmin: Boolean,
  // in more complex scenarios, we will have roles and operations
  // roles: [],
  // operations: [],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin,
    },
    // "jwtPrivateKey"
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);
exports.User = User;
// module.exports = userSchema.methods.generateAuthToken;
