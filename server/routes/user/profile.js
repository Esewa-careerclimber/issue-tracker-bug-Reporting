import express from 'express';
import { getProfile, updateProfile } from '../../controllers/user/profileController.js';
// FIX: Changed 'protect' to 'authenticate' to match the actual export name
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Use the correct 'authenticate' middleware
router.route('/')
  .get(authenticate, getProfile)
  .put(authenticate, updateProfile);

export default router;