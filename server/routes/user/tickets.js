import express from 'express';
import { createTicket, getUserTickets, getMyTickets, getSingleTicket } from '../../controllers/user/ticketController.js';
// FIX: Changed 'protect' to 'authenticate' to match the actual export name
import { authenticate } from '../../middleware/auth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

// Route to get all tickets and create a new ticket
router.route('/')
  .get(authenticate, getUserTickets)
  .post(authenticate, upload.single('attachment'), createTicket);

// Route to get tickets created by the logged-in user
router.get('/my-tickets', authenticate, getMyTickets);

// Route to get a single ticket by ID
router.get('/:id', authenticate, getSingleTicket);

export default router;
