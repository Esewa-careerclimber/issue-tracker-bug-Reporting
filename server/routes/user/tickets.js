import express from 'express';
import Ticket from '../../models/Ticket.js';
import { summarize } from '../../services/ai/summarizer.js';
import { identifySeverity } from '../../services/ai/severity.js';
import { protect as authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Create ticket
router.post('/', authenticate, async (req, res) => {
  try {
    const summary = summarize(req.body.description);
    const severity = identifySeverity(req.body.description);
    const ticket = await Ticket.create({
      ...req.body,
      summary,
      severity,
      createdBy: req.user.id
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tickets for the logged-in user
router.get('/', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id }).populate('comments');
  res.json(tickets);
});

// Get a single ticket (if owned by user)
router.get('/:id', authenticate, async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, createdBy: req.user.id }).populate('comments');
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
});

export default router;