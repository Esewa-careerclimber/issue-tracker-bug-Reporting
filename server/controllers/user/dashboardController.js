import Ticket from '../../models/Ticket.js';

export const getUserDashboardData = async (req, res) => {
  const open = await Ticket.countDocuments({ createdBy: req.user.id, status: 'open' });
  const inProgress = await Ticket.countDocuments({ createdBy: req.user.id, status: 'in-progress' });
  const closed = await Ticket.countDocuments({ createdBy: req.user.id, status: 'closed' });
  res.json({ open, inProgress, closed });
};