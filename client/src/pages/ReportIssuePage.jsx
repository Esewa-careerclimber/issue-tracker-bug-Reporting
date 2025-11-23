import React, { useState } from 'react';
import { ticketsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './ReportIssuePage.css';

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'bug',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await ticketsAPI.createTicket(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        category: 'bug',
        description: '',
        image: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        setSuccess(false);
        navigate('/my-issues');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-issue-page">
      <div className="report-header">
        <h1>Report an Issue</h1>
        <p>Help us improve by reporting bugs, requesting features, or providing feedback. AI will analyze severity automatically.</p>
      </div>

      {error && (
        <div style={{
          padding: '12px 20px',
          marginBottom: '20px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '12px 20px',
          marginBottom: '20px',
          backgroundColor: '#efe',
          color: '#3a3',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          Issue reported successfully! AI is analyzing the severity. Redirecting...
        </div>
      )}

      <form className="issue-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="title">Issue Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Issue Type *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="support">Support Request</option>
              <option value="feedback">General Feedback</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Attachment (optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.image && (
              <small style={{ display: 'block', marginTop: '4px', color: 'var(--color-text-muted)' }}>
                Selected: {formData.image.name}
              </small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the issue. Our AI will automatically analyze the severity and create a summary."
              rows="6"
              required
            />
            <small style={{ display: 'block', marginTop: '4px', color: 'var(--color-text-muted)' }}>
              💡 AI will automatically detect issue severity and generate a summary
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Submitting & Analyzing...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </div>
  );
}
