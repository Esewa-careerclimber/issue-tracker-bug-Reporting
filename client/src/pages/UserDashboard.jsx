import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UserDashboard.css';

// Sample data - would come from backend based on logged-in user
const assignedIssues = [
  {
    id: 1,
    title: 'Login button not responding on mobile',
    description: 'When users try to login on mobile devices, the login button becomes unresponsive after entering credentials.',
    priority: 'Critical',
    status: 'In Progress',
    assignedBy: 'Admin',
    assignedDate: 'Nov 3, 2025',
    dueDate: 'Nov 10, 2025',
    type: 'Bug',
    estimatedTime: '4 hours',
    tags: ['mobile', 'authentication', 'urgent']
  },
  {
    id: 2,
    title: 'Optimize database queries',
    description: 'Several endpoints are experiencing slow response times due to inefficient database queries.',
    priority: 'High',
    status: 'Open',
    assignedBy: 'Tech Lead',
    assignedDate: 'Nov 2, 2025',
    dueDate: 'Nov 15, 2025',
    type: 'Performance',
    estimatedTime: '8 hours',
    tags: ['backend', 'database', 'optimization']
  },
  {
    id: 3,
    title: 'Update documentation for API v2',
    description: 'Create comprehensive documentation for the new API version including all endpoints and examples.',
    priority: 'Medium',
    status: 'Open',
    assignedBy: 'Product Manager',
    assignedDate: 'Nov 1, 2025',
    dueDate: 'Nov 20, 2025',
    type: 'Documentation',
    estimatedTime: '6 hours',
    tags: ['documentation', 'api']
  },
  {
    id: 4,
    title: 'Implement dark mode',
    description: 'Add dark mode support across all pages with theme toggle in settings.',
    priority: 'Low',
    status: 'In Review',
    assignedBy: 'Design Lead',
    assignedDate: 'Oct 28, 2025',
    dueDate: 'Nov 5, 2025',
    type: 'Feature',
    estimatedTime: '10 hours',
    tags: ['ui', 'theme', 'feature']
  }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  };

  // Calculate statistics
  const stats = {
    total: assignedIssues.length,
    open: assignedIssues.filter(i => i.status === 'Open').length,
    inProgress: assignedIssues.filter(i => i.status === 'In Progress').length,
    inReview: assignedIssues.filter(i => i.status === 'In Review').length,
    completed: assignedIssues.filter(i => i.status === 'Completed').length
  };

  // Filter issues
  const filteredIssues = assignedIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter === 'all' || issue.status.toLowerCase().replace(' ', '-') === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': '#ef4444',
      'High': '#f97316',
      'Medium': '#eab308',
      'Low': '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': '#3b82f6',
      'In Progress': '#f59e0b',
      'In Review': '#8b5cf6',
      'Completed': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const handleStatusUpdate = (issueId, newStatus) => {
    console.log(`Updating issue ${issueId} to ${newStatus}`);
    // TODO: API call to update status
    alert(`Status updated to: ${newStatus}`);
    setSelectedIssue(null);
  };

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
              <span className="user-name">John Doe</span>
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
        <div className="stat-card" onClick={() => setFilter('in-review')}>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.inReview}</div>
          <div className="stat-label">In Review</div>
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
                className={`filter-tab ${filter === 'in-review' ? 'active' : ''}`}
                onClick={() => setFilter('in-review')}
              >
                In Review
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
              <div key={task.id} className="task-item" onClick={() => setSelectedIssue(task)}>
                <div className="task-content">
                  <div className="task-header-row">
                    <div className="task-title-section">
                      <h3 className="task-title">{task.title}</h3>
                      <span className="task-id">#{task.id}</span>
                    </div>
                    <div className="task-badges">
                      <span className="badge badge-type">{task.type}</span>
                      <span 
                        className="badge badge-priority"
                        style={{ 
                          backgroundColor: `${getPriorityColor(task.priority)}15`, 
                          color: getPriorityColor(task.priority) 
                        }}
                      >
                        {task.priority}
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
                  <p className="task-description">{task.description}</p>
                  <div className="task-footer">
                    <div className="task-meta">
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M2 14c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {task.assignedBy}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 7h10M5 2v3M11 2v3" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        Due {task.dueDate}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {task.estimatedTime}
                      </span>
                    </div>
                    <div className="task-tags">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
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
                <p className="modal-subtitle">Task #{selectedIssue.id} • Assigned by {selectedIssue.assignedBy}</p>
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
                        backgroundColor: `${getPriorityColor(selectedIssue.priority)}15`, 
                        color: getPriorityColor(selectedIssue.priority) 
                      }}
                    >
                      {selectedIssue.priority}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Type</label>
                    <span className="detail-badge">{selectedIssue.type}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item">
                    <label>Assigned Date</label>
                    <span className="detail-text">{selectedIssue.assignedDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Due Date</label>
                    <span className="detail-text">{selectedIssue.dueDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Estimated Time</label>
                    <span className="detail-text">{selectedIssue.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Description</h3>
                <p className="detail-description">{selectedIssue.description}</p>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Tags</h3>
                <div className="tags-container">
                  {selectedIssue.tags.map((tag, index) => (
                    <span key={index} className="tag-large">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Update Status</h3>
                <div className="status-actions">
                  {selectedIssue.status !== 'In Progress' && (
                    <button 
                      className="status-btn btn-progress"
                      onClick={() => handleStatusUpdate(selectedIssue.id, 'In Progress')}
                    >
                      Start Working
                    </button>
                  )}
                  {selectedIssue.status === 'In Progress' && (
                    <button 
                      className="status-btn btn-review"
                      onClick={() => handleStatusUpdate(selectedIssue.id, 'In Review')}
                    >
                      Submit for Review
                    </button>
                  )}
                  {selectedIssue.status !== 'Open' && (
                    <button 
                      className="status-btn btn-reopen"
                      onClick={() => handleStatusUpdate(selectedIssue.id, 'Open')}
                    >
                      Reopen Task
                    </button>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Add Note</h3>
                <textarea 
                  className="note-input"
                  placeholder="Add your progress notes, blockers, or questions here..."
                  rows="4"
                />
                <button className="submit-btn">Submit Note</button>
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
