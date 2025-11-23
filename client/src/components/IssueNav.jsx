import React from 'react';
import './IssueNav.css';

export function IssueNav({ onCategorySelect, issues = [] }) {
  // Calculate actual counts from issues data
  const bugCount = issues.filter(issue => issue.category === 'bug').length;
  const featureCount = issues.filter(issue => issue.category === 'feature').length;
  const criticalCount = issues.filter(issue => issue.severity === 'critical').length;
  const openCount = issues.filter(issue => issue.status === 'open').length;

  const issueCategories = [
    { label: 'Bug Reports', value: bugCount, color: 'red', type: 'bug' },
    { label: 'Feature Requests', value: featureCount, color: 'green', type: 'feature' },
    { label: 'Critical Issues', value: criticalCount, color: 'purple', priority: 'critical' },
    { label: 'Open Issues', value: openCount, color: 'blue', status: 'open' },
  ];

  return (
    <div className="issueNavContainer">
      <div className="issueNavGrid">
        {issueCategories.map((category) => (
          <div 
            key={category.label} 
            className={`issueNavCard ${category.color}Card`}
            onClick={() => onCategorySelect && onCategorySelect(category)}
          >
            <div className="issueNavValue">{category.value}</div>
            <div className="issueNavLabel">{category.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}