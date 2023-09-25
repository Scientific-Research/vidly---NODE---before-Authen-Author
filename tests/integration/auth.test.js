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

  it("should return 401 if no token is provided!", async () => {
    token = null;
    const res = await exec();
    expect(res.status).toBe(401);
  });
});
