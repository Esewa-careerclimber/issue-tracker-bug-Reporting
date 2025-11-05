import express from 'express';
import { protect as authenticate, admin as isAdmin } from '../../middleware/auth.js';
import {
  getAllTickets,
  updateTicketStatus,
  assignTicket
} from '../../controllers/admin/ticketController.js';

const router = express.Router();

// Get all tickets
router.get('/', authenticate, isAdmin, getAllTickets);

// Update ticket status
router.patch('/:id/status', authenticate, isAdmin, updateTicketStatus);

// Assign ticket to a user
router.patch('/:id/assign', authenticate, isAdmin, assignTicket);

export default router;