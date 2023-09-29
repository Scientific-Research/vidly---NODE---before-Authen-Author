// like always we start with Test Suits => describe()
let server;

describe("/api/returns", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });
});
