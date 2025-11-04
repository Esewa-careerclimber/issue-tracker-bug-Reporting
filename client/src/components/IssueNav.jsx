import React from 'react';
import { allIssues } from '../pages/DashboardPage';
import './IssueNav.css';

export function IssueNav({ onCategorySelect }) {
  // Calculate actual counts from allIssues data
  const bugCount = allIssues.filter(issue => issue.type === 'Bug').length;
  const featureCount = allIssues.filter(issue => issue.type === 'Feature').length;
  const criticalCount = allIssues.filter(issue => issue.priority === 'Critical').length;
  const openCount = allIssues.filter(issue => issue.status === 'Open').length;

  const issueCategories = [
    { label: 'Bug Reports', value: bugCount, color: 'red', type: 'Bug' },
    { label: 'Feature Requests', value: featureCount, color: 'green', type: 'Feature' },
    { label: 'Critical Issues', value: criticalCount, color: 'purple', priority: 'Critical' },
    { label: 'Open Issues', value: openCount, color: 'blue', status: 'Open' },
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