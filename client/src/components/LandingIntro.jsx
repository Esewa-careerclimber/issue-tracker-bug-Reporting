import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingIntro.css'

const LandingIntro = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    // Smooth scroll to the Access Your Workspace section
    const loginSection = document.querySelector('.login-section')
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleViewDemo = () => {
    navigate('/')
  }

  return (
    <div className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Modern Issue Tracking Platform
          </div>
          
          <h1 className="hero-title">
            Got an Issue with Your Team?
            <span className="gradient-text"> Track & Resolve It Here.</span>
          </h1>

          <p className="hero-description">
            Empower your team with intelligent issue tracking. From bug reports to feature requests,
            manage everything in one powerful platform. Built for modern teams who value speed and clarity.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">Fast</div>
              <div className="stat-label">Lightning Speed</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Simple</div>
              <div className="stat-label">Easy Setup</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">Free</div>
              <div className="stat-label">Start Today</div>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn-primary-hero" onClick={handleGetStarted}>
              Get Started Now
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-secondary-hero" onClick={handleViewDemo}>
              View Dashboard
            </button>
          </div>

          <div className="hero-trust">
            <span className="trust-text"></span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card card-1">
            <div className="card-header">
              <span className="status-badge critical">Critical</span>
              <span className="card-time">2 min ago</span>
            </div>
            <div className="card-title">Login authentication failing</div>
            <div className="card-footer">
              <div className="card-assignee">
                <div className="avatar avatar-1"></div>
                <div className="avatar avatar-2"></div>
                <div className="avatar avatar-3"></div>
              </div>
              <span className="card-comments">12 comments</span>
            </div>
          </div>

          <div className="visual-card card-2">
            <div className="card-header">
              <span className="status-badge resolved">Resolved</span>
              <span className="card-time">10 min ago</span>
            </div>
            <div className="card-title">Dashboard performance optimized</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>

          <div className="visual-card card-3">
            <div className="stats-mini">
              <div className="mini-stat">
                <div className="mini-number">47</div>
                <div className="mini-label">Open</div>
              </div>
              <div className="mini-stat">
                <div className="mini-number">23</div>
                <div className="mini-label">In Progress</div>
              </div>
              <div className="mini-stat">
                <div className="mini-number">156</div>
                <div className="mini-label">Resolved</div>
              </div>
            </div>
          </div>

          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
      </div>

      {/* Login Section */}
      <div className="login-section">
        <div className="login-container">
          <h2 className="login-title">Access Your Workspace</h2>
          <p className="login-subtitle">Choose your role to continue</p>
          
          <div className="role-cards">
            <div className="role-card" onClick={() => navigate('/login')}>
              <div className="role-icon admin-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="role-name">Admin</h3>
              <p className="role-description">Full access to manage teams, issues, and settings</p>
              <div className="role-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="role-card" onClick={() => navigate('/login')}>
              <div className="role-icon user-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="role-name">Team Member</h3>
              <p className="role-description">Report issues, track progress, and collaborate</p>
              <div className="role-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <div className="role-card" onClick={() => navigate('/login')}>
              <div className="role-icon guest-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="role-name">Guest</h3>
              <p className="role-description">Report issues and track your submissions</p>
              <div className="role-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingIntro
