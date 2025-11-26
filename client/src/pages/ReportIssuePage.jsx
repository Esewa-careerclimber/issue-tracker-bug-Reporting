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
    <div className="report-issue-page">
      {/* Navigation header for non-admin users */}
      {!isAdmin && (
        <nav className="report-issue-nav" style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: '12px 0',
          marginBottom: '24px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link to="/user" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'var(--color-text)',
              fontWeight: '600',
              fontSize: '18px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-primary)' }}>
                <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>IssueTracker</span>
            </Link>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link to="/user" style={{
                padding: '8px 16px',
                textDecoration: 'none',
                color: 'var(--color-text)',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'var(--color-hover)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                My Dashboard
              </Link>
            </div>
          </div>
        </nav>
      )}
      
      <div className="report-header">
        <h1>Report an Issue</h1>
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

        {isAdmin && (
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="assignee">Assign to team member</label>
              <select
                id="assignee"
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
              >
                <option value="">Unassigned for now</option>
                {assignableUsers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.username} — {member.role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={() => window.history.back()}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="small" inline={true} />
                <span>Submitting & Analyzing...</span>
              </>
            ) : (
              'Submit Issue'
            )}
          </button>
        </div>

        <button type="submit" className="submit-btn">Submit Issue</button>
      </form>
    </div>
  );
};

export default ReportIssuePage;