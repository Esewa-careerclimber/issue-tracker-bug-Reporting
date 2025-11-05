import express from 'express';
import {
  registerUser,
  registerAdmin,
  login,
  logout
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/admin', registerAdmin);
router.post('/login', login);
router.post('/logout', logout);

export default router;