import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ticketsAPI, notificationsAPI } from '../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { error: showError, success } = useToastContext();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    fetchAssignedIssues();
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchAssignedIssues = async () => {
    try {
      setLoading(true);
      // Fetch user's own created tickets (not assigned, but created by user)
      const data = await ticketsAPI.getMyTickets();
      setAssignedIssues(data || []);
    } catch (err) {
      setError('Failed to load your issues');
      console.error('Error fetching issues:', err);
      showError('Unable to load your latest reports.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const data = await notificationsAPI.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
      showError('Unable to load notifications.');
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const aiSummary =
    assignedIssues.find((issue) => issue.summary)?.summary ||
    'AI will summarize your next report automatically.';

  const severityMix = {
    critical: assignedIssues.filter((issue) => issue.severity === 'critical').length,
    high: assignedIssues.filter((issue) => issue.severity === 'high').length,
    medium: assignedIssues.filter((issue) => issue.severity === 'medium').length,
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

  // Users cannot update status - only admins can
  // This function is kept for UI consistency but won't actually update
  const handleStatusUpdate = async (issueId, newStatus) => {
    showError('Only admins can update issue status. Please contact your administrator.');
  };

  if (loading) {
    return (
      <div className="user-dashboard" style={{ padding: '60px', textAlign: 'center' }}>
        <LoadingSpinner size="large" text="Loading your workspace..." />
      </div>
    );
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
                <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="brand-text">IssueTracker</span>
              <span className="user-badge">User Portal</span>
            </div>
          </div>
          <div className="user-nav-right">
            <div style={{ position: 'relative', marginRight: '12px' }}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) fetchNotifications();
                }}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3a6 6 0 00-6 6v2.382c0 .734-.214 1.451-.614 2.064L4 15h16l-1.386-1.554A3.75 3.75 0 0118 11.382V9a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '12px',
                  minWidth: '320px',
                  maxWidth: '400px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--color-border)'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '4px 8px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {loadingNotifications ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                  ) : notifications.length > 0 ? (
                    <div>
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => {
                            if (!notification.read) {
                              handleMarkAsRead(notification._id);
                            }
                          }}
                          style={{
                            padding: '12px',
                            marginBottom: '8px',
                            background: notification.read ? 'transparent' : 'var(--color-surface-alt)',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (notification.read) {
                              e.currentTarget.style.background = 'var(--color-hover)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (notification.read) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontSize: '14px', 
                                fontWeight: notification.read ? '400' : '600',
                                marginBottom: '4px',
                                color: notification.read ? 'var(--color-text-muted)' : 'var(--color-text)'
                              }}>
                                {notification.message}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: 'var(--color-text-muted)'
                              }}>
                                {new Date(notification.createdAt).toLocaleString()}
                              </div>
                            </div>
                            {!notification.read && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#3b82f6',
                                marginLeft: '8px',
                                flexShrink: 0
                              }} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '40px 20px', 
                      textAlign: 'center',
                      color: 'var(--color-text-muted)'
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                          <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>No notifications</div>
                    </div>
                  )}
                </div>
              )}
            </div>
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
            <h1 className="page-title">My Issues</h1>
            <p className="page-subtitle">Issues you have created and reported</p>
          </div>
          <button 
            className="create-issue-btn"
            onClick={() => navigate('/report')}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#059669'}
            onMouseOut={(e) => e.target.style.background = '#10b981'}
          >
            + Create Issue
          </button>
        </div>

        <div className="role-panels">
          <div>
            <h3>Developers & Admins</h3>
            <p>Review updates pushed from the tester workspace and close the loop faster.</p>
          </div>
          <div>
            <h3>Testers & End Users</h3>
            <p>Capture bugs with evidence, category, and severity directly from the UI.</p>
          </div>
          <div>
            <h3>AI Analyst</h3>
            <p>Summaries and severity predictions are generated the moment you submit.</p>
          </div>
        </div>

        <div className="quick-actions">
          <button onClick={() => navigate('/report')}>Report a new issue</button>
          <button onClick={fetchAssignedIssues}>Refresh data</button>
          <button
            onClick={() => {
              if (!assignedIssues.length) return;
              navigate(`/issue/${assignedIssues[0]._id}`);
            }}
            disabled={!assignedIssues.length}
          >
            Open latest issue
          </button>
        </div>

        <div className="ai-summary-card">
          <div>
            <p className="ai-summary-label">AI summary briefing</p>
            <p style={{
              margin: 0,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              color: '#475569',
              fontStyle: 'italic'
            }}>
              {aiSummary}
            </p>
          </div>
          <div className="ai-severity-mix">
            <div>
              <span>Critical</span>
              <strong>{severityMix.critical}</strong>
            </div>
            <div>
              <span>High</span>
              <strong>{severityMix.high}</strong>
            </div>
            <div>
              <span>Medium</span>
              <strong>{severityMix.medium}</strong>
            </div>
          </div>
        </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card stat-card-total" onClick={() => setFilter('all')}>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card stat-card-open" onClick={() => setFilter('open')}>
          <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card stat-card-progress" onClick={() => setFilter('in-progress')}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-card-closed" onClick={() => setFilter('closed')}>
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.closed}</div>
          <div className="stat-label">Closed</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="content-card">
        <div className="card-header">
          <div className="card-title-section">
            <h2 className="card-title">My Issues</h2>
            <span className="task-count">{filteredIssues.length} issues</span>
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
              <div key={task._id} className="task-item">
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
                      padding: '12px 14px', 
                      background: '#f0f9ff', 
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#475569',
                      borderLeft: '3px solid #3b82f6',
                      lineHeight: '1.6'
                    }}>
                      <strong style={{ color: '#1e40af' }}>AI:</strong> {task.summary}
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
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/issue/${task._id}`)}
                      style={{ marginTop: '8px' }}
                    >
                      View Details
                    </button>
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
                <h3 className="section-title">Note</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  Only administrators can update issue status. If you need to change the status, please contact your admin.
                </p>
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
