const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

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
    // first test : client is not logged in
    it("should retuen 401 if client is not logged in", async () => {
      const res = await request(server).post("/api/genres").send({
        name: "genre1",
      });
      expect(res.status).toBe(401);
    });
    // second test : client is logged in, but send a genre less than 5 Characters(an invalid character)
    // first we need to logg in, we need to generate an Authentication Token and include that Token in this request(in the header).
    it("should return 400 if genre is less than 5 characters.", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "1234",
        });
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters.", async () => {
      const token = new User().generateAuthToken();

      // to create more than 50 characters => 51 here => we do as following:
      const nameMoreThan50Characters = new Array(52).join("a");
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          // name: "1234oiuefiouweioruijs",
          name: nameMoreThan50Characters,
        });
      expect(res.status).toBe(400);
    });

    // third test: if the Genre saved in the DataBase?
    it("should save the genre if it is valid.", async () => {
      // const token = new User().generateAuthToken();

      // const res = await request(server)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send({
      //     name: "genre1",
      //   });

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    // fourth test: should return the Genre if it is valid!
    it("should return the genre if it is valid.", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({
          name: "genre1",
        });

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
