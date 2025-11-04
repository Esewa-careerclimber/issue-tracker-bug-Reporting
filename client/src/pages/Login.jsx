import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
    companyCode: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate company code for admin and user
    if ((formData.role === 'admin' || formData.role === 'user') && !formData.companyCode) {
      alert('Company code is required for admin and team members!')
      return
    }
    
    // Simulate login - in real app, this would be an API call
    console.log('Login attempt:', formData)
    alert(`Logged in successfully as ${formData.role}!`)
    
    // Route based on role
    if (formData.role === 'admin') {
      navigate('/dashboard')
    } else if (formData.role === 'user') {
      navigate('/my-issues')
    } else {
      navigate('/report')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your workspace</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Login As</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="admin">Company Admin</option>
                <option value="user">Team Member</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            {(formData.role === 'admin' || formData.role === 'user') && (
              <div className="form-group">
                <label className="form-label">Company Code *</label>
                <input
                  type="text"
                  name="companyCode"
                  className="form-input"
                  placeholder="COMP-12345"
                  value={formData.companyCode}
                  onChange={handleChange}
                  required
                />
                <small className="form-hint">Enter your company's unique code</small>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-submit">
              Sign In
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          <div className="auth-footer">
            <p className="footer-text">
              Don't have an account? <Link to="/signup" className="footer-link">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      <Link to="/" className="back-to-home">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Home
      </Link>
    </div>
  )
}

export default Login
