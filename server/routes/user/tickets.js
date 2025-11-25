import express from 'express';
import {
  createTicket,
  getUserTickets,
  getMyTickets,
  getSingleTicket,
} from '../../controllers/user/ticketController.js';
import { protect } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';

const router = express.Router();

// Route to get all tickets and create a new ticket
// The 'createTicket' controller function now handles all logic, including AI calls.
router
  .route('/')
  .get(protect, getUserTickets)
  .post(protect, upload.single('attachment'), createTicket);

// Route for the logged-in user's specific tickets
router.route('/my-issues').get(protect, getMyTickets);

// Route to get a single ticket by its ID
router.route('/:id').get(protect, getSingleTicket);

export default router;