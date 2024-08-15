const request = require("supertest");
const app = require("../src/server"); // Your Express app
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Task = require("../src/models/Task");

describe("Task Routes", () => {
  let token;
  let adminUser;
  let taskId;

  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create an admin user
    adminUser = new User({
      username: "admin",
      password: "password123",
      role: "admin",
    });
    await adminUser.save();

    // Generate a token for the admin user
    const res = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "password123" });
    token = res.body.token;

    // Create a task for testing
    const task = new Task({
      title: "Sample Task",
      description: "This is a test task",
      status: "In Progress",
      priority: "High",
      user: adminUser._id, // Set the user field
      assignedUser: adminUser._id,
    });
    await task.save();
    taskId = task._id;
  });

  afterAll(async () => {
    // Clean up the database
    await Task.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it("should delete the task if user is admin", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");

    // Optionally, check if the task is actually deleted
    const deletedTask = await Task.findById(taskId);
    expect(deletedTask).toBeNull();
  });
});
