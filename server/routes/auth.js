import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register/user', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin Registration
router.post('/register/admin', async (req, res) => {
  try {
    const { username, email, password, company, department } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const admin = await User.create({
      username,
      email,
      password,
      role: 'admin',
      company,
      department
    });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      company: admin.company,
      department: admin.department,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      res.json({
        message: 'Login successful',
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
});

export default router;  