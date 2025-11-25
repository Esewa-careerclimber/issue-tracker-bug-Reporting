import Ticket from "../../models/Ticket.js";
import Comment from "../../models/Comment.js";
import { sendNotification } from "../../services/notification.js";

// Get all tickets (admin) with filtering and sorting
export const getAllTickets = async (req, res) => {
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
      sortOption = { severity: -1, createdAt: -1 };
    }

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "username email")
      .populate("assignedTo", "username company")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username email"
        }
      })
      .sort(sortOption);
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update ticket status (admin)
export const updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (ticket) {
    // Notify the ticket creator
    await sendNotification(
      ticket.createdBy,
      `Your ticket status was updated to ${status}.`
    );
    res.json(ticket);
  } else {
    res.status(404).json({ message: "Ticket not found" });
  }
};

// Assign ticket to a user (admin)
export const assignTicket = async (req, res) => {
  const { assignedTo } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { assignedTo },
    { new: true }
  ).populate("assignedTo", "username company");
  res.json(ticket);
};

// Delete ticket (admin)
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await Comment.deleteMany({ ticket: ticket._id });
    await Ticket.findByIdAndDelete(ticket._id);

    await sendNotification(
      ticket.createdBy,
      `Your ticket "${ticket.title}" was removed by the admin team.`
    );

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};