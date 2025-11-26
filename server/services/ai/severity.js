import axios from 'axios';
import config from '../../config/default.js';
import logger from '../../utils/logger.js';

export async function identifySeverity(description) {
  if (!description || typeof description !== 'string') {
    logger.warn('IdentifySeverity called with invalid description');
    return 'low';
  }

  const aiServiceUrl = config.aiServiceUrl;
  const timeout = 10000; // 10 second timeout

  try {
    logger.info(`Attempting to identify severity via AI service at ${aiServiceUrl}`);
    const response = await axios.post(
      `${aiServiceUrl}/severity`,
      { description },
      { timeout }
    );
    
    if (response.data && response.data.severity) {
      const severity = response.data.severity.toLowerCase();
      // Validate severity is one of the expected values
      const validSeverities = ['critical', 'high', 'medium', 'low'];
      if (validSeverities.includes(severity)) {
        logger.info(`AI severity identification successful: ${severity}`);
        return severity;
      } else {
        logger.warn(`AI service returned invalid severity: ${severity}, defaulting to medium`);
        return 'medium';
      }
    } else {
      logger.warn('AI service returned invalid response format for severity');
      return 'medium';
    }
  } catch (error) {
    // Log the error for debugging
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      logger.warn(`AI service unavailable at ${aiServiceUrl}: ${error.message}`);
    } else if (error.response) {
      logger.error(`AI service error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      logger.error(`AI severity identification error: ${error.message}`);
    }
    
    // Fallback: return medium severity
    return 'medium';
  }
}