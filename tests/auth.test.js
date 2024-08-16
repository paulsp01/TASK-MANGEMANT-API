const request = require("supertest");
const app = require("../src/server"); 
const mongoose = require("mongoose");
const User = require("../src/models/User");

describe("Auth Routes", () => {
  beforeAll(async () => {
   
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
   
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/register") 
      .send({
        username: "newuser",
        password: "password123",
        role: "user",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string"); 
  });
});
