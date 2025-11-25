import axios from 'axios';
import logger from '../../utils/logger.js';

export async function getSummary(title, description) {
  try {
    const response = await axios.post('http://ai-service:5002/summarize', { title, description });
    return response.data.summary;
  } catch (error) {
    logger.error(`AI summary generation failed: ${error.message}`);
    // Fallback if AI service is unavailable
    return null;
  }
}