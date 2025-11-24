import express from 'express';
import Comment from '../../models/Comment.js';
import Ticket from '../../models/Ticket.js';
import { protect as authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Add comment to ANY ticket (not just user's own tickets)
router.post('/:ticketId', authenticate, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const comment = await Comment.create({
      ticket: ticket._id,
      author: req.user.id,
      text: req.body.text
    });
    
    ticket.comments.push(comment._id);
    await ticket.save();
    
    // Populate author info before sending response
    await comment.populate('author', 'username email');
    
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comments for a specific ticket
router.get('/:ticketId', authenticate, async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate('author', 'username email')
      .sort({ createdAt: 1 });
    
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;