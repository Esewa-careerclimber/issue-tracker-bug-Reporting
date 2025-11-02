import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import './ImageMatchDashboard.css';

export function Layout({ children }) {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  
  return (
    <div className="dashboardContainer">
      <nav className="topNav">
        <div className="leftNav">
          <div className="brandLogo">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <span className="caterpillar">🐛</span>
              <h1 className="brandName">IssueTracker</h1>
            </Link>
          </div>
          <div className="navLinks">
            <Link to="/" className={`navLink ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/my-issues" className={`navLink ${location.pathname === '/my-issues' ? 'active' : ''}`}>My Issues</Link>
            <Link to="/report" className={`navLink ${location.pathname === '/report' ? 'active' : ''}`}>Report Issue</Link>
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
        {children}
      </main>
    </div>
  );
}
