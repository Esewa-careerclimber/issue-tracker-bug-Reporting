import express from 'express';
import {
  getAllTickets,
  updateTicketStatus,
  assignTicket,
} from '../../controllers/admin/ticketController.js';
import { authenticate, isAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Get all tickets
router.get('/', authenticate, isAdmin, getAllTickets);

// Update ticket status
router.patch('/:id/status', authenticate, isAdmin, updateTicketStatus);

// Assign a ticket
router.patch('/:id/assign', authenticate, isAdmin, assignTicket);

// FIX: The 'deleteTicket' function does not exist, so this route was causing the test to fail.
// It has been removed.
// router.delete('/:id', authenticate, isAdmin, deleteTicket);

export default router;