import React, { useState } from 'react';
import './ImageMatchDashboard.css';
import { useTheme } from './ThemeProvider';

// These match the exact values in the image
const issueTypes = [
  { label: 'Bug Reports', value: 47, color: 'red' },
  { label: 'Feature Requests', value: 23, color: 'green' },
  { label: 'Support Requests', value: 18, color: 'blue' },
  { label: 'General Feedback', value: 51, color: 'purple' },
];

export function ImageMatchDashboard() {
  const [searchText, setSearchText] = useState('');
  const { theme, toggle } = useTheme();
  
  return (
    <div className="dashboardContainer">
      <nav className="topNav">
        <div className="leftNav">
          <div className="brandLogo">
            <span className="caterpillar">🐛</span>
            <h1 className="brandName">IssueTracker</h1>
          </div>
          <div className="navLinks">
            <a href="#" className="navLink active">Dashboard</a>
            <a href="#" className="navLink">My Issues</a>
            <a href="#" className="navLink">Report Issue</a>
          </div>
        </div>
        <div className="rightNav">
          <button 
            onClick={toggle} 
            className="themeToggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <a href="#" className="notificationIcon">🔔</a>
          <div className="avatarContainer">
            <div className="userAvatar"></div>
          </div>
        </div>
      </nav>
      
      <main className="mainContent">
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
      </main>
    </div>
  );
}