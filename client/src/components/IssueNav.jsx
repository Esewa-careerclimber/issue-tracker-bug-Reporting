import React from 'react';
import './IssueNav.css';

const issueCategories = [
  { label: 'Bug Reports', value: 47, color: 'red' },
  { label: 'Feature Requests', value: 23, color: 'green' },
  { label: 'Support Requests', value: 18, color: 'blue' },
  { label: 'General Feedback', value: 51, color: 'purple' },
];

export function IssueNav({ onCategorySelect }) {
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