import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';

let userToken, adminToken, ticketId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Register and login a user
  await request(app).post('/api/auth/register/user').send({
    username: 'testuser',
    email: 'user@example.com',
    password: 'password'
  });
  const userLogin = await request(app).post('/api/auth/login').send({
    email: 'user@example.com',
    password: 'password'
  });
  userToken = userLogin.body.token;

  // Register and login an admin
  await request(app).post('/api/auth/register/admin').send({
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminpass',
    company: 'TestCo',
    department: 'IT'
  });
  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'adminpass'
  });
  adminToken = adminLogin.body.token;
}, 60000);

afterAll(async () => {
  await User.deleteMany({});
  await Ticket.deleteMany({});
  await Comment.deleteMany({});
  await mongoose.connection.close();
}, 30000);

describe('Server API Tests', () => {
  describe('GET /health', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toMatchObject({
        status: 'ok',
        message: 'Server is running'
      });
      // Don't test the exact db status as it may vary
      expect(response.body).toHaveProperty('db');
    }, 30000);
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toBe('Issue Tracker Backend is running!');
    }, 30000);
  });


  describe('Ticket and Comment API', () => {
    it('should create a ticket as user', async () => {
      const res = await request(app)
        .post('/api/user/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Bug in dashboard',
          description: 'Dashboard not loading',
          category: 'bug'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Bug in dashboard');
      ticketId = res.body._id;
    }, 30000);

    it('should add a comment as user', async () => {
      const res = await request(app)
        .post(`/api/user/comments/${ticketId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'I am also facing this issue.' });
      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe('I am also facing this issue.');
    }, 30000);

    it('should add a comment as admin', async () => {
      const res = await request(app)
        .post(`/api/admin/comments/${ticketId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ text: 'We are looking into this.' });
      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe('We are looking into this.');
    }, 30000);

    it('should update ticket status as admin', async () => {
      const res = await request(app)
        .patch(`/api/admin/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'in-progress' });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('in-progress');
    }, 30000);
  });
});