import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../context/AuthContext';
import './ImageMatchDashboard.css';

export function Layout() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
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
            <Link to="/dashboard" className={`navLink ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
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
          <div className="avatarContainer" style={{ position: 'relative' }}>
            <div 
              className="userAvatar" 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ cursor: 'pointer' }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '180px',
                boxShadow: 'var(--shadow)',
                zIndex: 1000
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.username}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{user?.email}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    color: 'var(--color-text)',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'var(--color-hover)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="mainContent">
        <Outlet />
      </main>
    </div>
  );
}
