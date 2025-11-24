import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminTicketsAPI } from '../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignedIssues();
  }, []);

  const fetchAssignedIssues = async () => {
    try {
      setLoading(true);
      // Fetch all tickets and filter by assignedTo matching current user
      const data = await adminTicketsAPI.getAllTickets();
      const myAssignedIssues = data.filter(ticket => 
        ticket.assignedTo?._id === user.id || ticket.assignedTo === user.id
      );
      setAssignedIssues(myAssignedIssues || []);
    } catch (err) {
      setError('Failed to load assigned tasks');
      console.error('Error fetching assigned tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  // Calculate statistics
  const stats = {
    total: assignedIssues.length,
    open: assignedIssues.filter(i => i.status === 'open').length,
    inProgress: assignedIssues.filter(i => i.status === 'in-progress').length,
    closed: assignedIssues.filter(i => i.status === 'closed').length
  };

  // Filter issues
  const filteredIssues = assignedIssues.filter(issue => {
    const matchesSearch = issue.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter === 'all' || issue.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': '#ef4444',
      'high': '#f97316',
      'medium': '#eab308',
      'low': '#10b981'
    };
    return colors[priority?.toLowerCase()] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': '#3b82f6',
      'in-progress': '#f59e0b',
      'closed': '#10b981'
    };
    return colors[status?.toLowerCase()] || '#6b7280';
  };

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      await adminTicketsAPI.updateTicketStatus(issueId, newStatus);
      await fetchAssignedIssues(); // Refresh data
      setSelectedIssue(null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your tasks...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Standalone User Navigation */}
      <nav className="user-nav">
        <div className="user-nav-container">
          <div className="user-nav-left">
            <div className="user-brand">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="brand-text">IssueFlow</span>
              <span className="user-badge">User Portal</span>
            </div>
          </div>
          <div className="user-nav-right">
            <button className="user-profile-btn">
              <div className="user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="user-name">{user?.username || 'User'}</span>
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="user-content">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">My Assigned Tasks</h1>
            <p className="page-subtitle">Tasks assigned to you by your team admin</p>
          </div>
        </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setFilter('all')}>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('open')}>
          <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('in-progress')}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('closed')}>
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.closed}</div>
          <div className="stat-label">Closed</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="content-card">
        <div className="card-header">
          <div className="card-title-section">
            <h2 className="card-title">Assigned Tasks</h2>
            <span className="task-count">{filteredIssues.length} tasks</span>
          </div>
          <div className="card-actions">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-tab ${filter === 'open' ? 'active' : ''}`}
                onClick={() => setFilter('open')}
              >
                Open
              </button>
              <button 
                className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
                onClick={() => setFilter('in-progress')}
              >
                In Progress
              </button>
              <button 
                className={`filter-tab ${filter === 'closed' ? 'active' : ''}`}
                onClick={() => setFilter('closed')}
              >
                Closed
              </button>
            </div>
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-list">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(task => (
              <div key={task._id} className="task-item" onClick={() => setSelectedIssue(task)}>
                <div className="task-content">
                  <div className="task-header-row">
                    <div className="task-title-section">
                      <h3 className="task-title">{task.title}</h3>
                      <span className="task-id">#{task._id?.slice(-6)}</span>
                    </div>
                    <div className="task-badges">
                      <span className="badge badge-type">{task.category}</span>
                      <span 
                        className="badge badge-priority"
                        style={{ 
                          backgroundColor: `${getPriorityColor(task.severity)}15`, 
                          color: getPriorityColor(task.severity) 
                        }}
                      >
                        {task.severity}
                      </span>
                      <span 
                        className="badge badge-status"
                        style={{ 
                          backgroundColor: `${getStatusColor(task.status)}15`, 
                          color: getStatusColor(task.status) 
                        }}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <p className="task-description">{task.description?.substring(0, 120)}...</p>
                  {task.summary && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '6px 10px', 
                      background: 'var(--color-surface-alt)', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontStyle: 'italic',
                      color: 'var(--color-text-muted)'
                    }}>
                      AI: {task.summary}
                    </div>
                  )}
                  <div className="task-footer">
                    <div className="task-meta">
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M2 14c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {task.createdBy?.username || 'Unknown'}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 7h10M5 2v3M11 2v3" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <p className="empty-message">No tasks found</p>
              <p className="empty-hint">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{selectedIssue.title}</h2>
                <p className="modal-subtitle">Task #{selectedIssue._id?.slice(-6)} • Assigned by Admin</p>
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
                      style={{ 
                        backgroundColor: `${getStatusColor(selectedIssue.status)}15`, 
                        color: getStatusColor(selectedIssue.status) 
                      }}
                    >
                      {selectedIssue.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Priority</label>
                    <span 
                      className="detail-badge"
                      style={{ 
                        backgroundColor: `${getPriorityColor(selectedIssue.severity)}15`, 
                        color: getPriorityColor(selectedIssue.severity) 
                      }}
                    >
                      {selectedIssue.severity}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Type</label>
                    <span className="detail-badge">{selectedIssue.category}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Assigned Date</label>
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
                <h3 className="section-title">Update Status</h3>
                <div className="status-actions">
                  {selectedIssue.status !== 'in-progress' && (
                    <button 
                      className="status-btn btn-progress"
                      onClick={() => handleStatusUpdate(selectedIssue._id, 'in-progress')}
                    >
                      Start Working
                    </button>
                  )}
                  {selectedIssue.status === 'in-progress' && (
                    <button 
                      className="status-btn btn-review"
                      onClick={() => handleStatusUpdate(selectedIssue._id, 'closed')}
                    >
                      Mark as Completed
                    </button>
                  )}
                  {selectedIssue.status !== 'open' && (
                    <button 
                      className="status-btn btn-reopen"
                      onClick={() => handleStatusUpdate(selectedIssue._id, 'open')}
                    >
                      Reopen Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserDashboard;
