import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <header className="header">
        <div className="site-name">
          Issue Tracker & Bug Reporting
        </div>
        <div className="header-buttons">
          <button onClick={() => navigate('/login')} className="header-btn btn-login">Login</button>
          <button onClick={() => navigate('/signup')} className="header-btn btn-signup">Signup</button>
        </div>
      </header>

      <main className="main-content">
        <div className="center-text">
          <div className="badge">Modern Issue Management</div>
          <h1>
            Track Issues.<br/>
            <span className="transition-text">Ship Faster.</span>
          </h1>
          <p>Simple bug tracking for modern teams. Report, track, and resolve issues efficiently with intelligent automation.</p>
        </div>
      </main>

      <footer className="footer">
        <div className="powered-by">
          Powered by <span className="ai-text">AI</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
