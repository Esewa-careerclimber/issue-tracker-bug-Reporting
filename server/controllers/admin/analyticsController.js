import Ticket from "../../models/Ticket.js";

export const getTicketStats = async (req, res) => {
  const total = await Ticket.countDocuments();
  const open = await Ticket.countDocuments({ status: "open" });
  const inProgress = await Ticket.countDocuments({ status: "in-progress" });
  const closed = await Ticket.countDocuments({ status: "closed" });
  const byCategory = await Ticket.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  res.json({ total, open, inProgress, closed, byCategory });
};
