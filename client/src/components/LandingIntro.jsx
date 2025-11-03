import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingIntro.css'

const LandingIntro = () => {
  const navigate = useNavigate()

  const handleReportClick = () => {
    navigate('/report')
  }

  const handleDashboardClick = () => {
    navigate('/')
  }

  return (
    <div className="landing-container">
      <h1 className="landing-title">
        Track Issues. <span className="highlight">Fix Faster.</span>
      </h1>

      <p className="landing-subtitle">
        Modern issue tracking powered by AI. Automatically categorize, prioritize,
        and resolve bugs with intelligent insights.
      </p>

      <div className="button-group">
        <button className="primary-btn" onClick={handleReportClick}>
          Report an Issue
        </button>
        <button className="secondary-btn" onClick={handleDashboardClick}>
          View Dashboard
        </button>
      </div>

      <p className="footer-note">
        “Turn chaos into clarity with intelligent bug management.”
      </p>
    </div>
  )
}

export default LandingIntro
