import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';
import dotenv from 'dotenv';

dotenv.config();

let userToken, user2Token, adminToken, ticketId, user2TicketId, adminUserId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clean up existing test data
  await User.deleteMany({ 
    email: { 
      $in: ['user@example.com', 'user2@example.com', 'admin@example.com', 'newuser@example.com', 'newadmin@example.com'] 
    } 
  });
  await Ticket.deleteMany({});
  await Comment.deleteMany({});

  // Wait a bit for cleanup to complete
  await new Promise(resolve => setTimeout(resolve, 500));

  // Register and login user 1
  const userReg = await request(app).post("/api/auth/register/user").send({
    username: "testuser",
    email: "user@example.com",
    password: "password",
  });
  
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "password",
  });
  userToken = userLogin.body.token;

  // Register and login user 2
  await request(app).post("/api/auth/register/user").send({
    username: "testuser2",
    email: "user2@example.com",
    password: "password",
  });
  
  const user2Login = await request(app).post("/api/auth/login").send({
    email: "user2@example.com",
    password: "password",
  });
  user2Token = user2Login.body.token;

  // Register admin and verify
  const adminReg = await request(app).post("/api/auth/register/admin").send({
    username: "admin",
    email: "admin@example.com",
    password: "adminpass",
    company: "TestCo",
    department: "IT",
  });
  
  console.log('✓ Admin Registration Response:', {
    status: adminReg.statusCode,
    role: adminReg.body.role,
    hasToken: !!adminReg.body.token
  });

  // Wait for database to persist
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verify admin exists in database
  const adminInDb = await User.findOne({ email: 'admin@example.com' });
  console.log('✓ Admin in Database:', {
    exists: !!adminInDb,
    role: adminInDb?.role,
    id: adminInDb?._id?.toString()
  });
  
  adminUserId = adminInDb?._id;

  // Login admin
  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "adminpass",
  });
  
  console.log('✓ Admin Login Response:', {
    status: adminLogin.statusCode,
    role: adminLogin.body.role,
    hasToken: !!adminLogin.body.token
  });
  
  adminToken = adminLogin.body.token;

  // Verify token can decode
  if (adminToken) {
    const jwt = await import('jsonwebtoken');
    try {
      const decoded = jwt.default.verify(adminToken, process.env.JWT_SECRET);
      console.log('✓ Admin Token Decoded:', { userId: decoded.id });
      
      // Verify user can be found with decoded ID
      const userFromToken = await User.findById(decoded.id);
      console.log('✓ User from Token:', {
        found: !!userFromToken,
        role: userFromToken?.role
      });
    } catch (err) {
      console.log('✗ Token Decode Error:', err.message);
    }
  }
  
}, 60000);

afterAll(async () => {
  await User.deleteMany({});
  await Ticket.deleteMany({});
  await Comment.deleteMany({});
  await mongoose.connection.close();
}, 30000);

describe("Server API Tests", () => {
  
  // ==================== AUTHENTICATION TESTS ====================
  describe("Authentication", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register/user")
        .send({
          username: "newuser",
          email: "newuser@example.com",
          password: "password123",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.role).toEqual("user");
    });

    it("should login an existing user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "user@example.com",
          password: "password",
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should register a new admin", async () => {
      const res = await request(app)
        .post("/api/auth/register/admin")
        .send({
          username: "newadmin",
          email: "newadmin@example.com",
          password: "adminpass123",
          company: "TechCorp",
          department: "Engineering",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.role).toEqual("admin");
    });
  });

  // ==================== USER TICKET TESTS ====================
  describe("User Tickets", () => {
    it("should create a ticket (User 1)", async () => {
      const res = await request(app)
        .post("/api/user/tickets")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Login Issue",
          description: "Cannot login to the application",
          stepsToReproduce: "1. Open app 2. Enter credentials 3. Click login",
          category: "bug",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      ticketId = res.body._id;
    });

    it("should create a ticket (User 2)", async () => {
      const res = await request(app)
        .post("/api/user/tickets")
        .set("Authorization", `Bearer ${user2Token}`)
        .send({
          title: "Feature Request - Dark Mode",
          description: "Please add dark mode to the app",
          category: "feature",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("_id");
      user2TicketId = res.body._id;
    });

    it("should get ALL tickets for User 1 (including User 2's tickets)", async () => {
      const res = await request(app)
        .get("/api/user/tickets")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should get only User 1's tickets from /myissues", async () => {
      const res = await request(app)
        .get("/api/user/tickets/myissues")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should filter tickets by category", async () => {
      const res = await request(app)
        .get("/api/user/tickets?category=bug")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.every(ticket => ticket.category === 'bug')).toBe(true);
    });

    it("should filter tickets by status", async () => {
      const res = await request(app)
        .get("/api/user/tickets?status=open")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.every(ticket => ticket.status === 'open')).toBe(true);
    });

    it("should sort tickets by oldest", async () => {
      const res = await request(app)
        .get("/api/user/tickets?sort=oldest")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      if (res.body.length > 1) {
        const dates = res.body.map(t => new Date(t.createdAt));
        expect(dates[0] <= dates[1]).toBe(true);
      }
    });

    it("should get a single ticket by ID", async () => {
      const res = await request(app)
        .get(`/api/user/tickets/${ticketId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toEqual(ticketId);
    });
  });

  // ==================== USER COMMENT TESTS ====================
  describe("User Comments", () => {
    it("should allow User 1 to comment on their own ticket", async () => {
      const res = await request(app)
        .post(`/api/user/comments/${ticketId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          text: "This is my comment on my ticket",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.text).toEqual("This is my comment on my ticket");
    });

    it("should allow User 1 to comment on User 2's ticket", async () => {
      const res = await request(app)
        .post(`/api/user/comments/${user2TicketId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          text: "Great feature request! I want this too.",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.text).toEqual("Great feature request! I want this too.");
    });

    it("should get all comments for a ticket", async () => {
      const res = await request(app)
        .get(`/api/user/comments/${user2TicketId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ==================== USER DASHBOARD TESTS ====================
  describe("User Dashboard", () => {
    it("should get dashboard data showing ALL users' tickets", async () => {
      const res = await request(app)
        .get("/api/user/dashboard")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("statusCounts");
      expect(res.body).toHaveProperty("categoryCounts");
      expect(res.body.statusCounts).toHaveProperty("total");
      expect(res.body.statusCounts.total).toBeGreaterThanOrEqual(2);
    });
  });

  // ==================== ADMIN TICKET TESTS ====================
  describe("Admin Tickets", () => {
    it("should get all tickets for admin", async () => {
      const res = await request(app)
        .get("/api/admin/tickets")
        .set("Authorization", `Bearer ${adminToken}`);
      
      if (res.statusCode !== 200) {
        console.log('✗ Admin Test Failed:', {
          status: res.statusCode,
          body: res.body,
          tokenPresent: !!adminToken
        });
      }
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should filter tickets by category (admin)", async () => {
      const res = await request(app)
        .get("/api/admin/tickets?category=feature")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.every(ticket => ticket.category === 'feature')).toBe(true);
    });

    it("should filter tickets by severity (admin)", async () => {
      const res = await request(app)
        .get("/api/admin/tickets?severity=low")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should update ticket status (admin)", async () => {
      const res = await request(app)
        .patch(`/api/admin/tickets/${ticketId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "in-progress",
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual("in-progress");
    });

    it("should assign ticket to a user (admin)", async () => {
      const users = await User.findOne({ email: 'user@example.com' });
      
      const res = await request(app)
        .patch(`/api/admin/tickets/${ticketId}/assign`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          assignedTo: users._id,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("assignedTo");
    });
  });

  // ==================== ADMIN COMMENT TESTS ====================
  describe("Admin Comments", () => {
    it("should allow admin to comment on any ticket", async () => {
      const res = await request(app)
        .post(`/api/admin/comments/${ticketId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          text: "Admin reviewing this issue",
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.text).toEqual("Admin reviewing this issue");
    });
  });

  // ==================== ADMIN DASHBOARD TESTS ====================
  describe("Admin Dashboard", () => {
    it("should get admin dashboard with total, categories, and severity breakdown", async () => {
      const res = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("statusCounts");
      expect(res.body).toHaveProperty("categoryCounts");
      expect(res.body).toHaveProperty("severityCounts");
      expect(res.body.statusCounts).toHaveProperty("total");
      expect(res.body.categoryCounts).toHaveProperty("bugReports");
      expect(res.body.severityCounts).toHaveProperty("critical");
    });
  });

  // ==================== USER PROFILE TESTS ====================
  describe("User Profile", () => {
    it("should get user profile", async () => {
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("email");
    });

    it("should update user profile", async () => {
      const res = await request(app)
        .put("/api/user/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          username: "updateduser",
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.username).toEqual("updateduser");
    });
  });
});