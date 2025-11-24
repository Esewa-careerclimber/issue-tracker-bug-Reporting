import Ticket from '../../models/Ticket.js';

export const getDashboardData = async (req, res) => {
  try {
    // Count tickets by status
    const open = await Ticket.countDocuments({ status: 'open' });
    const inProgress = await Ticket.countDocuments({ status: 'in-progress' });
    const closed = await Ticket.countDocuments({ status: 'closed' });
    const total = await Ticket.countDocuments();

    // Count tickets by category
    const bugReports = await Ticket.countDocuments({ category: 'bug' });
    const featureRequests = await Ticket.countDocuments({ category: 'feature' });
    const supportRequests = await Ticket.countDocuments({ category: 'support' });
    const generalFeedback = await Ticket.countDocuments({ category: 'feedback' });

    // Count by severity
    const critical = await Ticket.countDocuments({ severity: 'critical' });
    const high = await Ticket.countDocuments({ severity: 'high' });
    const medium = await Ticket.countDocuments({ severity: 'medium' });
    const low = await Ticket.countDocuments({ severity: 'low' });

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
      },
      severityCounts: {
        critical,
        high,
        medium,
        low
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};