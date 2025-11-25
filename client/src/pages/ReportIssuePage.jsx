import React, { useState, useEffect } from 'react';
import { ticketsAPI, adminUsersAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import './ReportIssuePage.css';

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { success, error: showError } = useToastContext();
  const [formData, setFormData] = useState({
    title: '',
    category: 'bug',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      try {
        const users = await adminUsersAPI.listUsers();
        setAssignableUsers(users || []);
      } catch (err) {
        console.error('Failed to load team members', err);
        showError('Unable to load team members for assignment.');
      }
    };
    fetchUsers();
  }, [isAdmin, showError]);
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
      const payload = { ...formData };
      if (isAdmin && selectedAssignee) {
        payload.assignedTo = selectedAssignee;
      } else if (!isAdmin && user?._id) {
        payload.assignedTo = user._id;
      }

      const createdTicket = await ticketsAPI.createTicket(payload);
      success('Issue created successfully! AI is analyzing severity...');
      
      // Reset form
      setFormData({
        title: '',
        category: 'bug',
        description: '',
        image: null
      });
      setSelectedAssignee('');
      
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      
      // Navigate to the newly created issue details page
      setTimeout(() => {
        if (createdTicket && createdTicket._id) {
          navigate(`/issue/${createdTicket._id}`);
        } else {
          navigate('/user');
        }
      }, 1200);
    } catch (err) {
      const errorMsg = err.message || 'Failed to create issue. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
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

      {error && (
        <div className="inline-error">
          {error}
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
      </form>
    </div>
  );
}
