import React, { useState } from 'react';

const issueTypes = [
  { label: 'Bug Reports', value: 47, color: 'red' },
  { label: 'Feature Requests', value: 23, color: 'green' },
  { label: 'Support Requests', value: 18, color: 'blue' },
  { label: 'General Feedback', value: 51, color: 'purple' },
];

export default function DashboardPage() {
  const [searchText, setSearchText] = useState('');
  
  return (
    <>
      <div className="statsContainer">
        {issueTypes.map(type => (
          <div key={type.label} className={`statCard ${type.color}Card`}>
            <div className="statValue">{type.value}</div>
            <div className="statLabel">{type.label}</div>
          </div>
        ))}
      </div>
      
      <div className="reportsSection">
        <div className="reportHeader">
          <h2>All Community Reports</h2>
          <div className="searchBox">
            <input 
              type="text"
              placeholder="Search issues..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="searchInput"
            />
          </div>
        </div>
        
        <div className="reportContent">
          {/* Empty content to match the image */}
        </div>
      </div>
    </>
  );
}
