const { User } = require("../../models/user");
const request = require("supertest");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    server.close();
    // await Genre.remove({});
  });

  let token;
  // using MH happy path:
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  // return 401 error when there is no
  it("should return 401 if no token is provided!", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  // return 400 eroor when token is invalid.
  it("should return 400 if token is invalid.!", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
});
