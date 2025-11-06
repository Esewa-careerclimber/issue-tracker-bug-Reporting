import Ticket from '../../models/Ticket.js';

// Create a ticket (user)
export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tickets for the user
export const getUserTickets = async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id }).populate('comments');
  res.json(tickets);
};

// Get a single ticket (if owned by user)
export const getSingleTicket = async (req, res) => {
  const ticket = await Ticket.findOne({ _id: req.params.id, createdBy: req.user.id }).populate('comments');
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
};