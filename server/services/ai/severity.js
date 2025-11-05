import axios from 'axios';

export async function identifySeverity(description) {
  try {
    const response = await axios.post('http://localhost:5002/severity', { description });
    return response.data.severity;
  } catch (error) {
    // Fallback if AI service is unavailable
    return 'low';
  }
}