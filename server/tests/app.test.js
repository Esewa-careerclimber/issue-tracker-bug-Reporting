import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import Comment from "../models/Comment.js";
import path from "path";
let userToken, adminToken, ticketId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register and login a user
  await request(app).post("/api/auth/register/user").send({
    username: "testuser",
    email: "user@example.com",
    password: "password",
  });
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "password",
  });
  userToken = userLogin.body.token;

  // Register and login an admin
  await request(app).post("/api/auth/register/admin").send({
    username: "admin",
    email: "admin@example.com",
    password: "adminpass",
    company: "TestCo",
    department: "IT",
  });
  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "adminpass",
  });
  adminToken = adminLogin.body.token;
}, 60000);

afterAll(async () => {
  await User.deleteMany({});
  await Ticket.deleteMany({});
  await Comment.deleteMany({});
  await mongoose.connection.close();
}, 30000);

describe("Server API Tests", () => {
  describe("GET /health", () => {
    it("should return server health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toMatchObject({
        status: "ok",
        message: "Server is running",
      });
      // Don't test the exact db status as it may vary
      expect(response.body).toHaveProperty("db");
    }, 30000);
  });

  describe("GET /", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/").expect(200);

      expect(response.text).toBe("Issue Tracker Backend is running!");
    }, 30000);
  });

  describe("Ticket and Comment API", () => {
    it("should create a ticket with image as user", async () => {
      // Use a valid image path. Place a small PNG file named 'test-image.png' in the 'server/tests' folder.
      const res = await request(app)
        .post("/api/user/tickets")
        .set("Authorization", `Bearer ${userToken}`)
        .field("title", "Bug with screenshot")
        .field("description", "Dashboard not loading")
        .field("category", "bug")
        .attach("image", path.resolve("server/tests/login.png"));
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("Bug with screenshot");
      expect(res.body).toHaveProperty("image");
      ticketId = res.body._id;
      expect(ticketId).toBeDefined();
    }, 30000);

    it("should add a comment as user", async () => {
      const res = await request(app)
        .post(`/api/user/comments/${ticketId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ text: "I am also facing this issue." });
      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe("I am also facing this issue.");
    }, 30000);

    it("should add a comment as admin", async () => {
      const res = await request(app)
        .post(`/api/admin/comments/${ticketId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ text: "We are looking into this." });
      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe("We are looking into this.");
    }, 30000);

    it("should update ticket status as admin", async () => {
      const res = await request(app)
        .patch(`/api/admin/tickets/${ticketId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "in-progress" });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("in-progress");
    }, 30000);
  });

  describe("Additional Admin Features", () => {
    it("should get all tickets as admin", async () => {
      const res = await request(app)
        .get("/api/admin/tickets")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach((ticket) => {
        if (ticket.assignedTo) {
          expect(ticket.assignedTo).toHaveProperty("username");
          expect(ticket.assignedTo).toHaveProperty("company");
        }
      });
    }, 30000);

    it("should assign ticket to user as admin", async () => {
      // Get user id
      const userRes = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);
      const userId = userRes.body.find(
        (u) => u.email === "user@example.com"
      )._id;

      const res = await request(app)
        .patch(`/api/admin/tickets/${ticketId}/assign`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ assignedTo: userId });
      expect(res.statusCode).toBe(200);
      expect(res.body.assignedTo).toHaveProperty("username");
      expect(res.body.assignedTo).toHaveProperty("company");
      expect(res.body.assignedTo._id).toBe(userId);
    }, 30000);

    it("should get admin dashboard data", async () => {
      const res = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("open");
      expect(res.body).toHaveProperty("inProgress");
      expect(res.body).toHaveProperty("closed");
    }, 30000);

    it("should get admin analytics data", async () => {
      const res = await request(app)
        .get("/api/admin/analytics/tickets")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("total");
      expect(res.body).toHaveProperty("open");
      expect(res.body).toHaveProperty("closed");
      expect(res.body).toHaveProperty("byCategory");
    }, 30000);
  });

  describe("Additional User Features", () => {
    it("should get all tickets for user", async () => {
      const res = await request(app)
        .get("/api/user/tickets")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    }, 30000);

    it("should get single ticket for user", async () => {
      const res = await request(app)
        .get(`/api/user/tickets/${ticketId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(ticketId);
    }, 30000);

    it("should get notifications for user", async () => {
      const res = await request(app)
        .get("/api/user/notifications")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }, 30000);

    it("should get user profile", async () => {
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("user@example.com");
    }, 30000);

    it("should update user profile", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ username: "updateduser", email: "user@example.com" });
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe("updateduser");
    }, 30000);

    it("should get user dashboard data", async () => {
      const res = await request(app)
        .get("/api/user/dashboard")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("open");
      expect(res.body).toHaveProperty("inProgress");
      expect(res.body).toHaveProperty("closed");
    }, 30000);
  });
});
