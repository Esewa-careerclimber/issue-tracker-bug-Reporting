import Ticket from '../../models/Ticket.js';

export const getUserDashboardData = async (req, res) => {
  try {
    // Count tickets by status (ALL users' tickets, not just current user)
    const open = await Ticket.countDocuments({ status: 'open' });
    const inProgress = await Ticket.countDocuments({ status: 'in-progress' });
    const closed = await Ticket.countDocuments({ status: 'closed' });
    const total = await Ticket.countDocuments();

    // Count tickets by category
    const bugReports = await Ticket.countDocuments({ category: 'bug' });
    const featureRequests = await Ticket.countDocuments({ category: 'feature' });
    const supportRequests = await Ticket.countDocuments({ category: 'support' });
    const generalFeedback = await Ticket.countDocuments({ category: 'feedback' });

    res.json({
      statusCounts: {
        open,
        inProgress,
        closed,
        total
      },
      categoryCounts: {
        bugReports,
        featureRequests,
        supportRequests,
        generalFeedback
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};