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

// Get all tickets (ALL users can see ALL tickets)
export const getUserTickets = async (req, res) => {
  try {
    // Build filter query based on query parameters
    const filter = {};
    
    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    // Filter by severity
    if (req.query.severity && req.query.severity !== 'all') {
      filter.severity = req.query.severity;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (req.query.sort === 'priority') {
      // Sort by severity priority: critical > high > medium > low
      sortOption = { severity: -1, createdAt: -1 };
    }

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'username email')
      .populate('comments')
      .sort(sortOption);
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get only the logged-in user's tickets (for "My Issues" page)
export const getMyTickets = async (req, res) => {
  try {
    // Build filter query - only tickets created by current user
    const filter = { createdBy: req.user.id };
    
    // Filter by category
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    // Filter by severity
    if (req.query.severity && req.query.severity !== 'all') {
      filter.severity = req.query.severity;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (req.query.sort === 'priority') {
      sortOption = { severity: -1, createdAt: -1 };
    }

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'username email')
      .populate('comments')
      .sort(sortOption);
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single ticket (any user can view any ticket)
export const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username email'
        }
      });
    
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};