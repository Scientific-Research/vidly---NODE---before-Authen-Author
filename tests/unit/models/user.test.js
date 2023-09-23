const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

// my Answer
// const user = require("../tests/user");

// describe("generateAuthToken", () => {
//   it("should return a jwt webtoken", () => {
//     const result = user.generateAuthToken();

//     expect(result).toMatchObject({
//       _id: this._id,
//       name: this.name,
//       email: this.email,
//       password: this.password,
//       isAdmin: this.isAdmin,
//     });
//   });
// });

//the answer created by KI in Bing

describe("generateAuthToken", () => {
  it("should return a valid jwt webtoken", () => {
    const payload = {
      // _id: 1,
      _id: new mongoose.Types.ObjectId(),
      name: "test",
      email: "test@example.com",
      password: "password123",
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    // expect(decoded).not.toBeNull();
    expect(decoded).toMatchObject(payload);
  });
});
