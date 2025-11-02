import express from 'express';
import Ticket from '../../models/Ticket.js';
import { protect as authenticate, admin as isAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Get all tickets
router.get('/', authenticate, isAdmin, async (req, res) => {
  const tickets = await Ticket.find().populate('createdBy assignedTo comments');
  res.json(tickets);
});

// Update ticket status
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(ticket);
});

// Assign ticket to a user
router.patch('/:id/assign', authenticate, isAdmin, async (req, res) => {
  const { assignedTo } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { assignedTo }, { new: true });
  res.json(ticket);
});

export default router;