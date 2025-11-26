import axios from 'axios';
import logger from '../../utils/logger.js';

/**
 * Calls the AI service to determine the severity of a ticket.
 * @param {string} title - The title of the ticket.
 * @param {string} description - The description of the ticket.
 * @returns {Promise<string>} The predicted severity ('low', 'medium', 'high', 'critical') or a fallback value.
 */
export async function getSeverity(title, description) {
  try {
    const response = await axios.post('http://ai-service:5002/classify-severity', {
      title,
      description,
    });
    return response.data.severity;
  } catch (error) {
    logger.error(`AI severity classification failed: ${error.message}`);
    // Fallback if AI service is unavailable or fails
    return 'low';
  }
}