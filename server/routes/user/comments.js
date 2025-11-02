import express from 'express';
import Comment from '../../models/Comment.js';
import Ticket from '../../models/Ticket.js';
import { protect as authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Add comment to a ticket (user must own the ticket)
router.post('/:ticketId', authenticate, async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.ticketId, createdBy: req.user.id });
  if (!ticket) return res.status(404).json({ message: 'Ticket not found or not yours' });

  const comment = await Comment.create({
    ticket: ticket._id,
    author: req.user.id,
    text: req.body.text
  });
  ticket.comments.push(comment._id);
  await ticket.save();
  res.status(201).json(comment);
});

export default router;