import React, { useState, useEffect } from 'react';
import { IssueNav } from '../components/IssueNav';
import { adminTicketsAPI, dashboardAPI } from '../services/api';
import './DashboardPage.css';

export default function DashboardPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all');
  const [allIssues, setAllIssues] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ open: 0, inProgress: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsData, statsData] = await Promise.all([
        adminTicketsAPI.getAllTickets(),
        dashboardAPI.getAdminDashboard()
      ]);
      
      setAllIssues(ticketsData || []);
      setDashboardStats(statsData || { open: 0, inProgress: 0, closed: 0 });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from actual data
  const totalIssues = allIssues.length;
  const openIssues = dashboardStats.open;
  const inProgressIssues = dashboardStats.inProgress;
  const resolvedIssues = dashboardStats.closed;

  const metrics = [
    { label: 'Total', value: totalIssues, color: '#3b82f6', filterKey: 'all' },
    { label: 'Open', value: openIssues, color: '#10b981', filterKey: 'open' },
    { label: 'In Progress', value: inProgressIssues, color: '#f59e0b', filterKey: 'in-progress' },
    { label: 'Resolved', value: resolvedIssues, color: '#8b5cf6', filterKey: 'closed' },
  ];

  const handleMetricClick = (filterKey) => {
    setFilter(filterKey);
  };

  const filteredIssues = allIssues.filter(issue => {
    const matchesSearch = issue.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                         issue.createdBy?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchText.toLowerCase());
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

  const handleUpdateStatus = async (newStatus) => {
    try {
      await adminTicketsAPI.updateTicketStatus(selectedIssue._id, newStatus);
      await fetchData(); // Refresh data
      setSelectedIssue(null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }
  
  return (
    <>
      <div className="admin-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of all reported issues</p>
        </div>
      </div>

      {/* Issue Category Navigation */}
      <IssueNav 
        issues={allIssues}
        onCategorySelect={(category) => {
          console.log('Selected category:', category);
          // Can be used to filter by type in the future
        }} 
      />

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
              <div key={issue._id} className="issue-item">
                <div className="issue-content">
                  <div className="issue-header-row">
                    <h3 className="issue-title-text">{issue.title}</h3>
                    <div className="issue-badges">
                      <span className="badge badge-type">{issue.category}</span>
                      <span 
                        className="badge badge-priority"
                        style={{ backgroundColor: `${getPriorityColor(issue.severity)}15`, color: getPriorityColor(issue.severity) }}
                      >
                        {issue.severity}
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
                  {issue.summary && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '8px 12px', 
                      background: 'var(--color-surface-alt)', 
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'var(--color-text-muted)'
                    }}>
                      <strong>AI Summary:</strong> {issue.summary}
                    </div>
                  )}
                  <div className="issue-footer">
                    <div className="issue-meta-info">
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M3 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        {issue.createdBy?.username || 'Unknown'}
                      </span>
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {formatDate(issue.createdAt)}
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
                <p className="modal-subtitle">Issue #{selectedIssue._id?.slice(-6)} • Reported by {selectedIssue.createdBy?.username || 'Unknown'}</p>
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

              <div className="detail-section">
                <h3 className="section-title">Reporter Information</h3>
                <div className="reporter-info">
                  <div className="reporter-avatar">{selectedIssue.createdBy?.username?.charAt(0).toUpperCase() || 'U'}</div>
                  <div>
                    <div className="reporter-name">{selectedIssue.createdBy?.username || 'Unknown'}</div>
                    <div className="reporter-email">{selectedIssue.createdBy?.email || 'N/A'}</div>
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
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedIssue(null)}>
                Close
              </button>
              <div className="status-actions">
                {selectedIssue.status !== 'open' && (
                  <button className="btn-status" onClick={() => handleUpdateStatus('open')}>
                    Mark as Open
                  </button>
                )}
                {selectedIssue.status !== 'in-progress' && (
                  <button className="btn-status" onClick={() => handleUpdateStatus('in-progress')}>
                    In Progress
                  </button>
                )}
                {selectedIssue.status !== 'closed' && (
                  <button className="btn-primary" onClick={() => handleUpdateStatus('closed')}>
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
