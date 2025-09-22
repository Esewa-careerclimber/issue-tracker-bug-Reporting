import request from 'supertest';
import app from '../server.js';

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
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toBe('Issue Tracker Backend is running!');
    });
  });
});