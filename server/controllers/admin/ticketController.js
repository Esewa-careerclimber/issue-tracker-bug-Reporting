import Ticket from "../../models/Ticket.js";
import { sendNotification } from "../../services/notification.js";

// Get all tickets (admin)
export const getAllTickets = async (req, res) => {
  const tickets = await Ticket.find()
    .populate("createdBy")
    .populate("assignedTo", "username company")
    .populate("comments");
  res.json(tickets);
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
