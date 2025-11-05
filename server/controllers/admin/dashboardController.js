import Ticket from '../../models/Ticket.js';

export const getDashboardData = async (req, res) => {
  const open = await Ticket.countDocuments({ status: 'open' });
  const inProgress = await Ticket.countDocuments({ status: 'in-progress' });
  const closed = await Ticket.countDocuments({ status: 'closed' });
  res.json({ open, inProgress, closed });
};