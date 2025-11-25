import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ticketsAPI, commentsAPI, adminTicketsAPI } from '../services/api';
import './IssueDetailsPage.css';

export default function IssueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { success, error: showError } = useToastContext();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssue();
    fetchComments();
  }, [id]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const data = await ticketsAPI.getTicketById(id);
      setIssue(data);
    } catch (err) {
      setError('Failed to load issue details');
      console.error('Error fetching issue:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await commentsAPI.getComments(id);
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await commentsAPI.addComment(id, newComment);
      setNewComment('');
      await fetchComments(); // Refresh to get updated list
      success('Comment added successfully!');
    } catch (err) {
      const errorMsg = 'Failed to add comment: ' + err.message;
      showError(errorMsg);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!isAdmin) {
      alert('Only admins can update issue status.');
      return;
    }

    try {
      setUpdatingStatus(true);
      await adminTicketsAPI.updateTicketStatus(id, newStatus);
      await fetchIssue(); // Refresh issue to get updated status
      success(`Issue status updated to ${newStatus}`);
    } catch (err) {
      const errorMsg = 'Failed to update status: ' + err.message;
      showError(errorMsg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': '#10b981',
      'in-progress': '#f59e0b',
      'closed': '#6b7280'
    };
    return colors[status?.toLowerCase()] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': '#ef4444',
      'high': '#f97316',
      'medium': '#eab308',
      'low': '#10b981'
    };
    return colors[priority?.toLowerCase()] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <LoadingSpinner size="large" text="Loading issue details..." />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        {error || 'Issue not found'}
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-details-page">
      {/* Navigation header for non-admin users */}
      {!isAdmin && (
        <nav className="issue-details-nav">
          <div className="issue-details-nav-container">
            <Link to="/user" className="nav-brand">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>IssueFlow</span>
            </Link>
            <div className="nav-actions">
              <Link to="/user" className="nav-link">My Dashboard</Link>
              <button onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }} className="nav-link">
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      
      <div className="issue-details-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 className="issue-details-title">{issue.title}</h1>
        <p className="issue-details-subtitle">
          Issue #{issue._id?.slice(-6)} • Created by {issue.createdBy?.username || 'Unknown'}
        </p>
      </div>

      <div className="issue-details-content">
        <div className="issue-details-main">
          <div className="detail-card">
            <div className="detail-section">
              <div className="detail-row">
                <div className="detail-item">
                  <label>Status</label>
                  <span 
                    className="detail-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(issue.status)}15`, 
                      color: getStatusColor(issue.status) 
                    }}
                  >
                    {issue.status}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Priority</label>
                  <span 
                    className="detail-badge"
                    style={{ 
                      backgroundColor: `${getPriorityColor(issue.severity)}15`, 
                      color: getPriorityColor(issue.severity) 
                    }}
                  >
                    {issue.severity}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Type</label>
                  <span className="detail-badge">{issue.category}</span>
                </div>
                <div className="detail-item">
                  <label>Created</label>
                  <span className="detail-text">{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {issue.summary && (
              <div className="detail-section">
                <h3 className="section-title">
                  <span style={{ marginRight: '8px' }}>🤖</span>
                  AI Summary
                </h3>
                <p className="detail-description ai-summary">
                  {issue.summary}
                </p>
              </div>
            )}

            <div className="detail-section">
              <h3 className="section-title">Description</h3>
              <p className="detail-description">{issue.description}</p>
            </div>

            {issue.image && (
              <div className="detail-section">
                <h3 className="section-title">Attachment</h3>
                <div className="attachment-container">
                  <img 
                    src={`http://localhost:5001/${issue.image}`} 
                    alt="Issue attachment" 
                    className="attachment-image"
                  />
                </div>
              </div>
            )}

            <div className="detail-section">
              <h3 className="section-title">Reporter Information</h3>
              <div className="reporter-info">
                <div className="reporter-avatar">
                  {issue.createdBy?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="reporter-name">{issue.createdBy?.username || 'Unknown'}</div>
                  <div className="reporter-email">{issue.createdBy?.email || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="section-title">Comments ({comments.length})</h3>
            {loadingComments ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <LoadingSpinner size="small" text="Loading comments..." />
              </div>
            ) : (
              <>
                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-author">
                            <div className="comment-avatar">
                              {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="comment-author-name">{comment.author?.username || 'Unknown'}</div>
                              <div className="comment-date">
                                {new Date(comment.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="comment-text">{comment.text}</div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-comments">
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                      <div>No comments yet. Be the first to comment!</div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleAddComment} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="comment-input"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="comment-submit-btn"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="issue-details-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Admin Actions</h3>
              <div className="status-actions">
                {issue.status !== 'open' && (
                  <button 
                    className="status-action-btn" 
                    onClick={() => handleUpdateStatus('open')}
                    disabled={updatingStatus}
                  >
                    Mark as Open
                  </button>
                )}
                {issue.status !== 'in-progress' && (
                  <button 
                    className="status-action-btn" 
                    onClick={() => handleUpdateStatus('in-progress')}
                    disabled={updatingStatus}
                  >
                    Mark as In Progress
                  </button>
                )}
                {issue.status !== 'closed' && (
                  <button 
                    className="status-action-btn primary" 
                    onClick={() => handleUpdateStatus('closed')}
                    disabled={updatingStatus}
                  >
                    Close Issue
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

