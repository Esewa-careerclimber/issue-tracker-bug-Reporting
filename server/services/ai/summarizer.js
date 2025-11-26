import axios from 'axios';
import config from '../../config/default.js';
import logger from '../../utils/logger.js';

export async function summarize(description) {
  if (!description || typeof description !== 'string') {
    logger.warn('Summarize called with invalid description');
    return description ? description.slice(0, 100) + '...' : 'No description provided';
  }

  const aiServiceUrl = config.aiServiceUrl;
  const timeout = 10000; // 10 second timeout

  try {
    logger.info(`Attempting to summarize via AI service at ${aiServiceUrl}`);
    const response = await axios.post(
      `${aiServiceUrl}/summarize`,
      { description },
      { timeout }
    );
    
    if (response.data && response.data.summary) {
      logger.info('AI summarization successful');
      return response.data.summary;
    } else {
      logger.warn('AI service returned invalid response format');
      return description.slice(0, 100) + '...';
    }
  } catch (error) {
    // Log the error for debugging
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      logger.warn(`AI service unavailable at ${aiServiceUrl}: ${error.message}`);
    } else if (error.response) {
      logger.error(`AI service error: ${error.response.status} - ${error.response.statusText}`);
    } else {
      logger.error(`AI summarization error: ${error.message}`);
    }
    
    // Fallback: return first 100 characters of description
    return description.slice(0, 100) + '...';
  }
}