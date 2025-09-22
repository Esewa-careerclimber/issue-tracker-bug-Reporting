import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; // Import the configured Express app

describe('Server API Tests', () => {
  // Connect to a test database before all tests
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/issue_tracker_test';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Disconnect from the test database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /health', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Service is running'
      });
    });
  });

  // Example of a placeholder test for an API endpoint
  describe('GET /api/issues', () => {
    it('should return a list of issues', async () => {
      // This test will need to be updated once you have a real issue model and data
      const response = await request(app)
        .get('/api/issues')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});