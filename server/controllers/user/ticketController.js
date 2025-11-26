import Ticket from '../../models/Ticket.js';
import { getSummary } from '../../services/ai/summarizer.js';
import { getSeverity } from '../../services/ai/severity.js';
import { notifyAdmins } from '../../services/notification.js';
import logger from '../../utils/logger.js';

// Create a ticket (user)
export const createTicket = async (req, res) => {
  const { title, description, type, category } = req.body;

  try {
    if (!title || !description || !type || !category) {
      return res.status(400).json({ message: 'Missing required fields: title, description, type, or category.' });
    }

    // --- AI Service Calls with Error Handling ---
    let summary = description; // Default summary
    try {
      const aiSummary = await getSummary(title, description);
      if (aiSummary) summary = aiSummary;
    } catch (aiError) {
      logger.error(`AI summary generation failed: ${aiError.message}`);
      // Non-critical error, proceed with default summary
    }

    let severity = 'low'; // Default severity
    try {
      const aiSeverity = await getSeverity(title, description);
      if (aiSeverity) severity = aiSeverity;
    } catch (aiError) {
      logger.error(`AI severity classification failed: ${aiError.message}`);
      // Non-critical error, proceed with default severity
    }
    // --- End of AI Service Calls ---

    const newTicketData = {
      title,
      description,
      summary,
      ticketType: type,
      category,
      severity,
      createdBy: req.user.id,
      status: 'open',
    };

    if (req.file) {
      newTicketData.attachment = req.file.path;
    }

    const newTicket = new Ticket(newTicketData);
    const ticket = await newTicket.save();

    await notifyAdmins(
      `New ticket created: ${ticket.title}`,
      `/admin/dashboard/tickets/${ticket._id}`
    );

    res.status(201).json(ticket);
  } catch (error) {
    logger.error({
      message: `Error saving ticket to database: ${error.message}`,
      stack: error.stack,
      user: req.user.id,
    });
    res.status(500).json({ message: 'An internal server error occurred while saving the ticket.' });
  }
};

// Get all tickets
export const getUserTickets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    if (req.query.severity && req.query.severity !== 'all') filter.severity = req.query.severity;

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };
    else if (req.query.sort === 'priority') sortOption = { severity: -1, createdAt: -1 };

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'username email')
      .populate('comments')
      .sort(sortOption);

    res.json(tickets);
  } catch (err) {
    logger.error(`Error fetching user tickets: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Get only the logged-in user's tickets
export const getMyTickets = async (req, res) => {
  try {
    const filter = { createdBy: req.user.id };
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    if (req.query.severity && req.query.severity !== 'all') filter.severity = req.query.severity;

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };
    else if (req.query.sort === 'priority') sortOption = { severity: -1, createdAt: -1 };

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'username email')
      .populate('comments')
      .sort(sortOption);

    res.json(tickets);
  } catch (err) {
    logger.error(`Error fetching my tickets: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Get a single ticket
export const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username email' },
      });

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    logger.error(`Error fetching single ticket: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};