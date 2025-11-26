import Ticket from '../../models/Ticket.js';
import { sendNotification } from '../../services/notification.js';
import logger from '../../utils/logger.js';

// Get all tickets (admin) with filtering and sorting
export const getAllTickets = async (req, res) => {
  try {
    const filter = {};
    // FIX: Updated to filter by the correct fields: 'ticketType' and 'category'
    if (req.query.ticketType && req.query.ticketType !== 'all') filter.ticketType = req.query.ticketType;
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    if (req.query.severity && req.query.severity !== 'all') filter.severity = req.query.severity;

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };
    else if (req.query.sort === 'priority') sortOption = { severity: -1, createdAt: -1 };

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username company')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username email',
        },
      })
      .sort(sortOption);

    res.json(tickets);
  } catch (err) {
    logger.error(`Admin: Error fetching all tickets: ${err.message}`);
    res.status(500).json({ message: 'An internal server error occurred while fetching tickets.' });
  }
};

// Update ticket status (admin)
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (ticket) {
      await sendNotification(
        ticket.createdBy,
        `Your ticket status was updated to ${status}.`
      );
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    logger.error(`Admin: Error updating ticket status: ${error.message}`);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

// Assign ticket to a user (admin)
export const assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'username company');

    if (ticket) {
      await sendNotification(
        ticket.createdBy,
        `Your ticket has been assigned to ${ticket.assignedTo.username}.`
      );
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    logger.error(`Admin: Error assigning ticket: ${error.message}`);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};