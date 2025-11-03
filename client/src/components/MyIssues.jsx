import React, { useState } from "react";
import { allIssues } from "../pages/DashboardPage";
import "./MyIssues.css";

const MyIssues = () => {
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Use shared data from DashboardPage
  const issues = allIssues;

  //Filtering 
  const filteredIssues = issues
    .filter(
      (issue) =>
        (category === "All" || issue.type === category) &&
        (status === "All" || issue.status === status) &&
        (severity === "All" || issue.priority === severity)
    )
    .sort((a, b) => {
      if (sortBy === "Newest") return 0; // assume data is already newest first
      if (sortBy === "Oldest") return -1;
      if (sortBy === "Priority") {
        const priorityOrder = { Critical: 1, High: 2, Medium: 3, Low: 4 };
        return (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
      }
      return 0;
    });

  // Badges 
  const getBadgeClass = (type) => {
    switch (type) {
      case "Bug":
        return "badge bug";
      case "Feature":
        return "badge feature";
      case "Support":
        return "badge support";
      case "Feedback":
        return "badge feedback";
      default:
        return "badge default";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "status open";
      case "In Progress":
        return "status in-progress";
      case "Reviewed":
        return "status reviewed";
      case "Closed":
        return "status closed";
      default:
        return "status default";
    }
  };

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
    console.log(`Updating issue ${selectedIssue.id} to status: ${newStatus}`);
    alert(`Status updated to: ${newStatus}`);
    setSelectedIssue(null);
  };

  return (
    <div className="issues-page">
      <header className="issues-header">
        <h1>My Reported Issues</h1>
        <p>Track all your submitted tickets, bugs, and feedback.</p>
      </header>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">Category: All</option>
          <option value="Bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="Support">Support</option>
          <option value="Feedback">Feedback</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Closed">Closed</option>
        </select>

        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="All">Priority: All</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
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
            <div className="issue-card" key={issue.id}>
              <h3>{issue.title}</h3>
              <div className="tags">
                <span className={getBadgeClass(issue.type)}>{issue.type}</span>
                <span className={`tag priority ${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </span>
                <span className={getStatusClass(issue.status)}>{issue.status}</span>
              </div>
              <p>{issue.description}</p>
              <div className="issue-card-footer">
                <small>Updated {issue.time}</small>
                <button 
                  className="view-details-btn"
                  onClick={() => setSelectedIssue(issue)}
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
    </div>
  );
};

export default MyIssues;
