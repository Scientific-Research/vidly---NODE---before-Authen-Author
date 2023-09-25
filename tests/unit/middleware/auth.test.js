const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
  items("should populate req.user with the payload of a valid JWT", () => {
    const token = new User().generateAuthToken();

    auth(req, res, next);
  });
});
