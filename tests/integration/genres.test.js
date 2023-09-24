const request = require("supertest");
const { Genre } = require("../../models/genre");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    ///////////////////////////////////////////////////////////////////////////////!first Integration Test
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({
        name: "genre1",
      });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      // expect(res.body).toMatchObject(genre);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    //////////////////////////////////////////////////////////////////////////////////////!first Integration Test
    //////////////////////////////////////////////////////////////////////////////////////!second Integration Test
    it("should return 404 if invalid id is passedd! ", async () => {
      // const genre = new Genre({
      //   name: "genre1",
      // });
      // await genre.save();

      // const res = await request(server).get("/api/genres/" + genre._id);
      // we give the id=1 deliberately!
      const res = await request(server).get("/api/genres/1");
      // if (!res) {
      expect(res.status).toBe(404);
      // expect(() => {
      //   lib.registerUser(a);
      // }).toThrow("The genre with the given ID was not found.");
      //}
    });
    //////////////////////////////////////////////////////////////////////////////////////!second Integration Test
  });

  describe("POST /", () => {
    it("should retuen 401 if client is not logged in", async () => {
      const res = await request(server).post("/api/genres").send({
        name: "genre1",
      });
      expect(res.status).toBe(401);
    });
  });
});
