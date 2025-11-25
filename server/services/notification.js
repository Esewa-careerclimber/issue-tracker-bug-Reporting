import Notification from '../models/Notification.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Sends a notification to a specific user.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} message - The notification message.
 * @param {string} [link] - An optional link for the notification.
 */
export const sendNotification = async (userId, message, link) => {
  try {
    await Notification.create({
      user: userId,
      message,
      link,
    });
  } catch (error) {
    logger.error(`Error sending notification to user ${userId}: ${error.message}`);
  }
};

/**
 * Sends a notification to all users with the 'admin' role.
 * @param {string} message - The notification message.
 * @param {string} [link] - An optional link for the notification.
 */
export const notifyAdmins = async (message, link) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('_id');
    const notifications = admins.map(admin => ({
      user: admin._id,
      message,
      link,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    logger.error(`Error sending notification to admins: ${error.message}`);
  }
};