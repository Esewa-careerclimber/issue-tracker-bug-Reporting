import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../services/api';
import './ImageMatchDashboard.css';

export function Layout() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const handleBrandRefresh = () => window.location.reload();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const data = await notificationsAPI.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="dashboardContainer">
      <nav className="topNav">
        <div className="leftNav">
          <div className="brandLogo">
            <button type="button" className="brandButton" onClick={handleBrandRefresh}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h1 className="brandName">IssueTracker</h1>
            </button>
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
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) fetchNotifications();
              }}
              className="notificationIcon"
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3a6 6 0 00-6 6v2.382c0 .734-.214 1.451-.614 2.064L4 15h16l-1.386-1.554A3.75 3.75 0 0118 11.382V9a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '12px',
                minWidth: '320px',
                maxWidth: '400px',
                maxHeight: '500px',
                overflowY: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--color-border)'
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px 8px'
                    }}
                  >
                    ×
                  </button>
                </div>
                {loadingNotifications ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                ) : notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => {
                          if (!notification.read) {
                            handleMarkAsRead(notification._id);
                          }
                        }}
                        style={{
                          padding: '12px',
                          marginBottom: '8px',
                          background: notification.read ? 'transparent' : 'var(--color-surface-alt)',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (notification.read) {
                            e.currentTarget.style.background = 'var(--color-hover)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (notification.read) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: notification.read ? '400' : '600',
                              marginBottom: '4px',
                              color: notification.read ? 'var(--color-text-muted)' : 'var(--color-text)'
                            }}>
                              {notification.message}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: 'var(--color-text-muted)'
                            }}>
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {!notification.read && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#3b82f6',
                              marginLeft: '8px',
                              flexShrink: 0
                            }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    padding: '40px 20px', 
                    textAlign: 'center',
                    color: 'var(--color-text-muted)'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                        <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>No notifications</div>
                  </div>
                )}
              </div>
            )}
          </div>
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Logout
                  </span>
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
