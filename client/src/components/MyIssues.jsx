import React, { useState, useEffect } from "react";
import { ticketsAPI, commentsAPI } from "../services/api";
import "./MyIssues.css";

const MyIssues = () => {
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await ticketsAPI.getMyTickets();
      setIssues(data || []);
    } catch (err) {
      setError('Failed to load issues');
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  //Filtering 
  const filteredIssues = issues
    .filter(
      (issue) =>
        (category === "All" || issue.category === category.toLowerCase()) &&
        (status === "All" || issue.status === status.toLowerCase()) &&
        (severity === "All" || issue.severity === severity.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "Priority") {
        const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
        return (priorityOrder[a.severity] || 5) - (priorityOrder[b.severity] || 5);
      }
      return 0;
    });

  // Badges 
  const getBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case "bug":
        return "badge bug";
      case "feature":
        return "badge feature";
      case "support":
        return "badge support";
      case "feedback":
        return "badge feedback";
      default:
        return "badge default";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "status open";
      case "in-progress":
        return "status in-progress";
      case "closed":
        return "status closed";
      default:
        return "status default";
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

  const handleUpdateStatus = (newStatus) => {
    console.log(`Updating issue ${selectedIssue._id} to status: ${newStatus}`);
    alert(`Status updated to: ${newStatus}`);
    setSelectedIssue(null);
  };

  const fetchComments = async (ticketId) => {
    try {
      setLoadingComments(true);
      const data = await commentsAPI.getComments(ticketId);
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
    if (!newComment.trim() || !selectedIssue) return;

    try {
      setSubmittingComment(true);
      const comment = await commentsAPI.addComment(selectedIssue._id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      alert('Failed to add comment: ' + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setComments([]);
    setNewComment('');
    if (issue) {
      fetchComments(issue._id);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your issues...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <div className="issues-page">
      <header className="issues-header">
        <h1>My Reported Issues</h1>
        <p>Track all your submitted tickets, bugs, and feedback.</p>
      </header>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">Category: All</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="support">Support</option>
          <option value="feedback">Feedback</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="All">Priority: All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="Newest">Sort: Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Priority">Sort by Priority</option>
        </select>
      </div>

      <div className="issue-list">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div className="issue-card" key={issue._id}>
              <h3>{issue.title}</h3>
              <div className="tags">
                <span className={getBadgeClass(issue.category)}>{issue.category}</span>
                <span className={`tag priority ${issue.severity?.toLowerCase()}`}>
                  {issue.severity}
                </span>
                <span className={getStatusClass(issue.status)}>{issue.status}</span>
              </div>
              <p>{issue.description?.substring(0, 150)}...</p>
              {issue.summary && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '6px 10px', 
                  background: 'var(--color-surface-alt)', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: 'var(--color-text-muted)'
                }}>
                  AI: {issue.summary}
                </div>
              )}
              <div className="issue-card-footer">
                <small>Created {new Date(issue.createdAt).toLocaleDateString()}</small>
                <button 
                  className="view-details-btn"
                  onClick={() => handleIssueSelect(issue)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No issues found.</div>
        )}
      </div>

      {/* Modal for issue details - same as Dashboard */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{selectedIssue.title}</h2>
                <p className="modal-subtitle">Issue #{selectedIssue._id?.slice(-6)} • Reported by you</p>
              </div>
              <button className="modal-close" onClick={() => setSelectedIssue(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Status</label>
                    <span 
                      className="detail-badge"
                      style={{ backgroundColor: `${getStatusColor(selectedIssue.status)}15`, color: getStatusColor(selectedIssue.status) }}
                    >
                      {selectedIssue.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Priority</label>
                    <span 
                      className="detail-badge"
                      style={{ backgroundColor: `${getPriorityColor(selectedIssue.severity)}15`, color: getPriorityColor(selectedIssue.severity) }}
                    >
                      {selectedIssue.severity}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Type</label>
                    <span className="detail-badge">{selectedIssue.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date</label>
                    <span className="detail-text">{new Date(selectedIssue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {selectedIssue.summary && (
                <div className="detail-section">
                  <h3 className="section-title">AI Summary</h3>
                  <p className="detail-description" style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                    {selectedIssue.summary}
                  </p>
                </div>
              )}

              <div className="detail-section">
                <h3 className="section-title">Description</h3>
                <p className="detail-description">{selectedIssue.description}</p>
              </div>

              {selectedIssue.image && (
                <div className="detail-section">
                  <h3 className="section-title">Attachment</h3>
                  <img 
                    src={`http://localhost:5001/${selectedIssue.image}`} 
                    alt="Issue attachment" 
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                  />
                </div>
              )}

              <div className="detail-section">
                <h3 className="section-title">Comments ({comments.length})</h3>
                {loadingComments ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Loading comments...</div>
                ) : (
                  <>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment._id} style={{
                            padding: '12px',
                            marginBottom: '12px',
                            background: 'var(--color-surface-alt)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                {comment.author?.username || 'Unknown'}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                {new Date(comment.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--color-text)' }}>
                              {comment.text}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          No comments yet. Be the first to comment!
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          minHeight: '60px'
                        }}
                        required
                      />
                      <button
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        style={{
                          padding: '10px 20px',
                          background: submittingComment ? 'var(--color-text-muted)' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: submittingComment ? 'not-allowed' : 'pointer',
                          fontWeight: '500',
                          alignSelf: 'flex-start'
                        }}
                      >
                        {submittingComment ? 'Posting...' : 'Post'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => {
                setSelectedIssue(null);
                setComments([]);
                setNewComment('');
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIssues;
