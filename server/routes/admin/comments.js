import express from 'express';
import Comment from '../../models/Comment.js';
import Ticket from '../../models/Ticket.js';
import { protect as authenticate, admin as isAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Admin can comment on any ticket
router.post('/:ticketId', authenticate, isAdmin, async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

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