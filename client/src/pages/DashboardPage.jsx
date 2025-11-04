import React, { useState } from 'react';
import { IssueNav } from '../components/IssueNav';
import './DashboardPage.css';

// This will be shared data across pages
export const allIssues = [
  {
    id: 1,
    title: 'Login button not responding on mobile',
    description: 'When users try to login on mobile devices, the login button becomes unresponsive after entering credentials. This affects iOS Safari and Chrome browsers.',
    type: 'Bug',
    priority: 'Critical',
    status: 'Open',
    author: 'John Doe',
    email: 'john.doe@example.com',
    time: '2 hours ago',
    date: 'Nov 3, 2025 16:30',
    stepsToReproduce: '1. Open app on mobile\n2. Enter credentials\n3. Tap login button\n4. Button becomes unresponsive',
    expectedBehavior: 'User should be logged in successfully',
    actualBehavior: 'Button does not respond to taps'
  },
  {
    id: 2,
    title: 'Add dark mode to settings page',
    description: 'Users have requested a dark mode option in the settings page to reduce eye strain during night usage.',
    type: 'Feature',
    priority: 'Low',
    status: 'Reviewed',
    author: 'Jane Smith',
    email: 'jane.smith@example.com',
    time: '5 hours ago',
    date: 'Nov 3, 2025 13:15'
  },
  {
    id: 3,
    title: 'Page crashes when submitting form',
    description: 'The application crashes when submitting the contact form with all fields filled. This happens consistently on Chrome and Firefox.',
    type: 'Bug',
    priority: 'High',
    status: 'In Progress',
    author: 'Mike Johnson',
    email: 'mike.j@example.com',
    time: '1 day ago',
    date: 'Nov 2, 2025 14:20',
    stepsToReproduce: '1. Fill all form fields\n2. Click submit button\n3. Page crashes',
    expectedBehavior: 'Form should submit successfully',
    actualBehavior: 'Application crashes and refreshes'
  },
  {
    id: 4,
    title: 'Improve loading performance',
    description: 'Dashboard takes too long to load initial data. Users are experiencing 5-10 second delays on first load.',
    type: 'Feature',
    priority: 'Medium',
    status: 'Open',
    author: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    time: '2 days ago',
    date: 'Nov 1, 2025 10:45'
  },
  {
    id: 5,
    title: 'Unable to reset password',
    description: 'Password reset emails are not being delivered to users. Verified that emails are not in spam folders.',
    type: 'Bug',
    priority: 'High',
    status: 'Open',
    author: 'Tom Brown',
    email: 'tom.brown@example.com',
    time: '3 days ago',
    date: 'Oct 31, 2025 09:30'
  }
];

export default function DashboardPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all');

  // Calculate metrics from actual data
  const totalIssues = allIssues.length;
  const openIssues = allIssues.filter(i => i.status === 'Open').length;
  const inProgressIssues = allIssues.filter(i => i.status === 'In Progress').length;
  const resolvedIssues = allIssues.filter(i => i.status === 'Reviewed' || i.status === 'Closed').length;

  const metrics = [
    { label: 'Total', value: totalIssues, color: '#3b82f6', filterKey: 'all' },
    { label: 'Open', value: openIssues, color: '#10b981', filterKey: 'open' },
    { label: 'In Progress', value: inProgressIssues, color: '#f59e0b', filterKey: 'in-progress' },
    { label: 'Resolved', value: resolvedIssues, color: '#8b5cf6', filterKey: 'reviewed' },
  ];

  const handleMetricClick = (filterKey) => {
    setFilter(filterKey);
  };

  const filteredIssues = allIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         issue.author.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter === 'all' || issue.status.toLowerCase().replace(' ', '-') === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Open': '#10b981',
      'In Progress': '#f59e0b',
      'Reviewed': '#3b82f6',
      'Closed': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': '#ef4444',
      'High': '#f97316',
      'Medium': '#eab308',
      'Low': '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  const handleUpdateStatus = (newStatus) => {
    // TODO: Update issue status in backend
    console.log(`Updating issue ${selectedIssue.id} to status: ${newStatus}`);
    alert(`Status updated to: ${newStatus}`);
    setSelectedIssue(null);
  };
  
  return (
    <>
      <div className="admin-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of all reported issues</p>
        </div>
      </div>

      {/* Issue Category Navigation */}
      <IssueNav onCategorySelect={(category) => {
        console.log('Selected category:', category);
        // Can be used to filter by type in the future
      }} />

      <div className="metrics-grid-modern">
        {metrics.map((metric, index) => (
          <div 
            key={metric.label} 
            className="metric-card-modern clickable" 
            style={{ '--accent-color': metric.color }}
            onClick={() => handleMetricClick(metric.filterKey)}
          >
            <div className="metric-content">
              <div className="metric-value-modern">{metric.value}</div>
              <div className="metric-label-modern">{metric.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="content-card">
        <div className="card-header">
          <div className="card-title-section">
            <h2 className="card-title">Recent Issues</h2>
            <span className="issue-count">{filteredIssues.length} total</span>
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
                className={`filter-tab ${filter === 'reviewed' ? 'active' : ''}`}
                onClick={() => setFilter('reviewed')}
              >
                Reviewed
              </button>
            </div>
            <input 
              type="text"
              placeholder="Search issues..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="issues-list">
          {filteredIssues.length > 0 ? (
            filteredIssues.map(issue => (
              <div key={issue.id} className="issue-item">
                <div className="issue-content">
                  <div className="issue-header-row">
                    <h3 className="issue-title-text">{issue.title}</h3>
                    <div className="issue-badges">
                      <span className="badge badge-type">{issue.type}</span>
                      <span 
                        className="badge badge-priority"
                        style={{ backgroundColor: `${getPriorityColor(issue.priority)}15`, color: getPriorityColor(issue.priority) }}
                      >
                        {issue.priority}
                      </span>
                      <span 
                        className="badge badge-status"
                        style={{ backgroundColor: `${getStatusColor(issue.status)}15`, color: getStatusColor(issue.status) }}
                      >
                        {issue.status}
                      </span>
                    </div>
                  </div>
                  <p className="issue-description">{issue.description.substring(0, 120)}...</p>
                  <div className="issue-footer">
                    <div className="issue-meta-info">
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {issue.author}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {issue.time}
                      </span>
                    </div>
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-modern">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                <path d="M32 20v24M20 32h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No issues found</p>
            </div>
          )}
        </div>
      </div>

      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{selectedIssue.title}</h2>
                <p className="modal-subtitle">Issue #{selectedIssue.id} • Reported by {selectedIssue.author}</p>
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
                      style={{ backgroundColor: `${getPriorityColor(selectedIssue.priority)}15`, color: getPriorityColor(selectedIssue.priority) }}
                    >
                      {selectedIssue.priority}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Type</label>
                    <span className="detail-badge">{selectedIssue.type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date</label>
                    <span className="detail-text">{selectedIssue.date}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Reporter Information</h3>
                <div className="reporter-info">
                  <div className="reporter-avatar">{selectedIssue.author.charAt(0)}</div>
                  <div>
                    <div className="reporter-name">{selectedIssue.author}</div>
                    <div className="reporter-email">{selectedIssue.email}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3 className="section-title">Description</h3>
                <p className="detail-description">{selectedIssue.description}</p>
              </div>

              {selectedIssue.stepsToReproduce && (
                <div className="detail-section">
                  <h3 className="section-title">Steps to Reproduce</h3>
                  <pre className="detail-steps">{selectedIssue.stepsToReproduce}</pre>
                </div>
              )}

              {selectedIssue.expectedBehavior && (
                <div className="detail-section">
                  <div className="behavior-grid">
                    <div>
                      <h3 className="section-title">Expected Behavior</h3>
                      <p className="detail-description">{selectedIssue.expectedBehavior}</p>
                    </div>
                    <div>
                      <h3 className="section-title">Actual Behavior</h3>
                      <p className="detail-description">{selectedIssue.actualBehavior}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedIssue(null)}>
                Close
              </button>
              <div className="status-actions">
                {selectedIssue.status !== 'Open' && (
                  <button className="btn-status" onClick={() => handleUpdateStatus('Open')}>
                    Mark as Open
                  </button>
                )}
                {selectedIssue.status !== 'In Progress' && (
                  <button className="btn-status" onClick={() => handleUpdateStatus('In Progress')}>
                    In Progress
                  </button>
                )}
                {selectedIssue.status !== 'Reviewed' && (
                  <button className="btn-status" onClick={() => handleUpdateStatus('Reviewed')}>
                    Mark Reviewed
                  </button>
                )}
                {selectedIssue.status !== 'Closed' && (
                  <button className="btn-primary" onClick={() => handleUpdateStatus('Closed')}>
                    Close Issue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
