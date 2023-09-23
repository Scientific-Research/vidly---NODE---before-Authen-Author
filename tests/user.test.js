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
const { User } = require("../tests/user");

describe("generateAuthToken", () => {
  it("should return a jwt webtoken", () => {
    const user = new User({
      name: "test",
      email: "test@example.com",
      password: "password123",
      isAdmin: false,
    });
    const token = user.generateAuthToken();

    expect(token).not.toBeNull();
  });
});
