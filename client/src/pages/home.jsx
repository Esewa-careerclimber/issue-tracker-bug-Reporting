import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Issue Tracking & AI Insights</p>
          <h1>
            Ship reliable releases with a workflow that feels handcrafted for
            modern product teams.
          </h1>
          <p className="subtitle">
            A single space where testers report, developers resolve, and our AI
            co-pilot summarizes every update in plain language.
          </p>
          <div className="cta-group">
            <button
              className="btn-primary"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              Get started
            </button>
            {showOptions && (
              <div className="cta-options">
                <button onClick={() => navigate('/login')}>Log in</button>
                <button
                  className="secondary"
                  onClick={() => navigate('/signup')}
                >
                  Create account
                </button>
              </div>
            )}
          </div>
          <div className="hero-highlights">
            <div>
              <h4>Developers & Admins</h4>
              <p>Review, prioritize, and close issues pulled directly from the live API.</p>
            </div>
            <div>
              <h4>Testers & End Users</h4>
              <p>Report bugs with attachments, severity, and category in seconds.</p>
            </div>
            <div>
              <h4>AI Analyst</h4>
              <p>Summarizes every report and predicts impact so teams know where to focus.</p>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-header">
            <span>Live Signals</span>
            <span className="pill">Powered by AI</span>
          </div>
          <div className="panel-metric">
            <p>Critical issues flagged</p>
            <h2>82%</h2>
            <small>Automatically prioritized in the admin workspace.</small>
          </div>
          <div className="panel-metric">
            <p>Average response time</p>
            <h2>2.4h</h2>
            <small>Notifications keep everyone in the loop instantly.</small>
          </div>
          <div className="panel-footer">
            <span>Next step:</span>
            <button onClick={() => navigate('/signup')}>Create workspace</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
