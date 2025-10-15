import React, { useState } from 'react';
import './SimpleDashboard.css';
import { IssueNav } from './IssueNav';

export function SimpleDashboard() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  return (
    <div className="simpleDashboard">
      <header className="dashboardHeader">
        <div className="logoSection">
          <div className="logo">
            <img src="https://placehold.co/40x40/FFD700/FFF?text=🐛" alt="IssueTracker Logo" />
            <span className="logoText">IssueTracker</span>
          </div>
          <nav className="mainNav">
            <a href="#" className="navItem active">Dashboard</a>
            <a href="#" className="navItem">My Issues</a>
            <a href="#" className="navItem">Report Issue</a>
          </nav>
        </div>
        <div className="userSection">
          <button className="notificationBtn">
            <span className="notifIcon">🔔</span>
          </button>
          <div className="userAvatar">
            <img src="https://placehold.co/40x40/CCCCCC/FFF" alt="User Avatar" />
          </div>
        </div>
      </header>

      <div className="dashboardContent">
        <IssueNav onCategorySelect={handleCategorySelect} />

        <div className="reportsSection">
          <div className="sectionHeader">
            <h2>All Community Reports</h2>
            <div className="searchContainer">
              <input 
                type="text" 
                placeholder="Search issues..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="searchInput"
              />
            </div>
          </div>

          <div className="reportsContent">
            {/* This would contain the reports/issues list */}
            <div className="emptyState">
              <p>{selectedCategory ? `Viewing ${selectedCategory.label}` : 'Select a report type to view issues'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}