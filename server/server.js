import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001; 

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    db: dbStatus
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Issue Tracker Backend is running!');
});

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:',err)); 
}

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;

//! made some changes(changed port,import route, changed mongo_url to mongodb_url, added line in .catch)