import axios from 'axios';

export async function summarize(description) {
  try {
    const response = await axios.post('http://localhost:5002/summarize', { description });
    return response.data.summary;
  } catch (error) {
    // Fallback if AI service is unavailable
    return description.slice(0, 100) + '...';
  }
}