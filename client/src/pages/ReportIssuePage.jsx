import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsAPI } from '../services/api';
import './ReportIssuePage.css';

const ReportIssuePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('bug');
  const [category, setCategory] = useState('general');
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !type || !category) {
      setError('Please fill in all required fields.');
      return;
    }

    const ticketData = {
      title,
      description,
      type,
      category,
      attachment,
    };

    try {
      await ticketsAPI.createTicket(ticketData);
      setSuccess('Issue reported successfully! Redirecting...');
      setTimeout(() => navigate('/my-issues'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to report issue.');
    }
  };

  return (
    <div className="report-issue-container">
      <div className="report-issue-header">
        <h1>Report Issue</h1>
        <p>Help us improve by reporting bugs, requesting features, or providing feedback. AI will analyze severity automatically.</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form className="report-issue-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Issue Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* FIX: This div wraps the two dropdowns and applies the flexbox styles */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Issue Type *</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="general">General</option>
              <option value="ui-ux">UI/UX</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="attachment">Attachment (optional)</label>
          <input
            type="file"
            id="attachment"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="8"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">Submit Issue</button>
      </form>
    </div>
  );
};

export default ReportIssuePage;