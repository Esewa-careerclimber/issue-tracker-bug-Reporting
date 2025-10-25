import React, { useState } from "react";
import "./MyIssues.css";

const MyIssues = () => {
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const issues = [
    {
      id: 1,
      title: "Login button not working",
      type: "Bug",
      priority: "Critical",
      status: "Open",
      description: "Login button does not respond on mobile devices.",
      updated: "1 day ago",
    },
    {
      id: 2,
      title: "Dark mode suggestion",
      type: "Feature",
      priority: "Low",
      status: "Reviewed",
      description: "Suggest adding a dark mode option to settings.",
      updated: "1 day ago",
    },
    {
      id: 3,
      title: "Page crashes on save",
      type: "Bug",
      priority: "High",
      status: "In Progress",
      description: "The page crashes when saving a form with all fields filled.",
      updated: "3 days ago",
    },
  ];

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
              <small>Updated {issue.updated}</small>
            </div>
          ))
        ) : (
          <div className="empty-state">No issues found.</div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
