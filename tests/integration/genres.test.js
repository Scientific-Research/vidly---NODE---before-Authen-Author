const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

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

    it("should return 404 if no genre with the given ID exists! ", async () => {
      // const genre = new Genre({
      //   name: "genre1",
      // });
      // await genre.save();

      // const res = await request(server).get("/api/genres/" + genre._id);
      // we give the id=1 deliberately!
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
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
    // Define the happy path, and then in each test, we change one parameter that clearly aligns with the name of
    // the test.
    let name;
    let token;

    // This is our happy path:
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        // .send({
        //   // name: "genre1",
        //   name: name,
        // });
        // or in ES6, when the key and value are the same, we can make it short with key or value:
        .send({
          // name: "genre1",
          name,
        });
    };
    // and then, define a beforeEach() and when it 's needed, we will modify one of these two parameters
    // in every of our tests accordingly
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    // first test : client is not logged in
    it("should return 401 if client is not logged in", async () => {
      // const res = await request(server).post("/api/genres").send({
      //   name: "genre1",
      // });
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    // second test : client is logged in, but send a genre less than 5 Characters(an invalid character)
    // first we need to logg in, we need to generate an Authentication Token and include that Token in this request(in the header).
    it("should return 400 if genre is less than 5 characters.", async () => {
      // const token = new User().generateAuthToken();

      // const res = await request(server)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send({
      //     name: "1234",
      //   });

      name = "1234";

      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters.", async () => {
      // const token = new User().generateAuthToken();

      // to create more than 50 characters => 51 here => we do as following:
      // const nameMoreThan50Characters = new Array(52).join("a");
      name = new Array(52).join("a");

      // const res = await request(server)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send({
      //     // name: "1234oiuefiouweioruijs",
      //     name: nameMoreThan50Characters,
      //   });
      const res = await exec();
      expect(res.status).toBe(400);
    });

    // third test: if the Genre saved in the DataBase?
    it("should save the genre if it is valid.", async () => {
      // const token = new User().generateAuthToken();

      //TODO:
      // const res = await exec();
      await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    // fourth test: should return the Genre if it is valid!
    it("should return the genre if it is valid.", async () => {
      // const token = new User().generateAuthToken();

      // const res = await request(server)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send({
      //     name: "genre1",
      //   });
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  // Test put endpoint
  describe("PUT /:id", () => {
    // This is our happy path:
    let token;
    let newName;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/genres" + id)
        .set("x-auth-token", token)
        // .send({
        //   // name: "genre1",
        //   name: name,
        // });
        // or in ES6, when the key and value are the same, we can make it short with key or value:
        .send({ name: newName });
    };

    it("should return 400 if genre is less than 5 characters.", async () => {
      // const token = new User().generateAuthToken();

      // const res = await request(server)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send({
      //     name: "1234",
      //   });

      name = "1234";

      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters.", async () => {
      // const token = new User().generateAuthToken();

      // to create more than 50 characters => 51 here => we do as following:
      // const nameMoreThan50Characters = new Array(52).join("a");
      name = new Array(52).join("a");

      // const res = await request(server)
      //   .post("/api/genres")
      //   .set("x-auth-token", token)
      //   .send({
      //     // name: "1234oiuefiouweioruijs",
      //     name: nameMoreThan50Characters,
      //   });
      const res = await exec();
      expect(res.status).toBe(400);
    });

    ///////////////////////////////////////////////////////////////////////////////!first Integration Test
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({
        name: "genre1",
      });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      name = "genre2";
      res = await request(server).put("/api/genres/" + genre._id);

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
      const res = await request(server).put("/api/genres/1");
      // if (!res) {
      expect(res.status).toBe(404);
      // expect(() => {
      //   lib.registerUser(a);
      // }).toThrow("The genre with the given ID was not found.");
      //}
    });

    it("should return 404 if no genre with the given ID exists! ", async () => {
      // const genre = new Genre({
      //   name: "genre1",
      // });
      // await genre.save();

      // const res = await request(server).get("/api/genres/" + genre._id);
      // we give the id=1 deliberately!
      const id = mongoose.Types.ObjectId();
      const res = await request(server).put("/api/genres/" + id);
      // if (!res) {
      expect(res.status).toBe(404);
      // expect(() => {
      //   lib.registerUser(a);
      // }).toThrow("The genre with the given ID was not found.");
      //}
    });
    //////////////////////////////////////////////////////////////////////////////////////!second Integration Test
  });

  // Test Delete endpoint
  describe("DELETE /:id", () => {
    ///////////////////////////////////////////////////////////////////////////////!first Integration Test
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({
        name: "genre1",
      });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      // name = "genre2";
      res = await request(server).delete("/api/genres/" + genre._id);

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
      const res = await request(server).delete("/api/genres/1");
      // if (!res) {
      expect(res.status).toBe(404);
      // expect(() => {
      //   lib.registerUser(a);
      // }).toThrow("The genre with the given ID was not found.");
      //}
    });

    it("should return 404 if no genre with the given ID exists! ", async () => {
      // const genre = new Genre({
      //   name: "genre1",
      // });
      // await genre.save();

      // const res = await request(server).get("/api/genres/" + genre._id);
      // we give the id=1 deliberately!
      const id = mongoose.Types.ObjectId();
      const res = await request(server).delete("/api/genres/" + id);
      // if (!res) {
      expect(res.status).toBe(404);
      // expect(() => {
      //   lib.registerUser(a);
      // }).toThrow("The genre with the given ID was not found.");
      //}
    });
    //////////////////////////////////////////////////////////////////////////////////////!second Integration Test
  });
});
