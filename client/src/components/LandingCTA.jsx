import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingCTA.css";

const LandingCTA = () => {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/report"); 
  };

  const handleDashboardClick = () => {
    navigate("/"); 
  };

  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">Ready to Streamline your Issue tracking?</h2>
        <p className="cta-subtitle">
          Join thousands of teams using <span className="brand">BugTrackr</span>{" "}
          to build better products faster.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={handleReportClick}>
            Get Started
          </button>
          <button className="btn-outline" onClick={handleDashboardClick}>
            Explore Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;
