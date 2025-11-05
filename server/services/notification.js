import Notification from '../models/Notification.js';

// Save notification to the database for in-app display
export async function sendNotification(userId, message) {
  await Notification.create({ user: userId, message });
}