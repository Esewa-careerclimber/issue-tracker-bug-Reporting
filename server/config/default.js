export default {
  jwtSecret: process.env.JWT_SECRET || 'yoursecret',
  port: process.env.PORT || 5001,
  aiServiceUrl: process.env.AI_SERVICE_URL || (process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV ? 'http://ai-service:5002' : 'http://localhost:5002')
};