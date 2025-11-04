import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    
    // Admin-specific fields
    companyName: '',
    registrationNumber: '',
    companyEmail: '',
    companyPhone: '',
    
    // User-specific fields
    employeeId: '',
    department: '',
    workingCompany: '',
    managerEmail: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    // Validate required fields based on role
    if (formData.role === 'admin') {
      if (!formData.companyName || !formData.registrationNumber) {
        alert('Please fill in all company details!')
        return
      }
    } else if (formData.role === 'user') {
      if (!formData.workingCompany || !formData.department) {
        alert('Please fill in all employment details!')
        return
      }
    }
    
    // Simulate signup - in real app, this would be an API call
    console.log('Signup attempt:', formData)
    alert(`Account created successfully as ${formData.role}!`)
    
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
      <div className="auth-container signup-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Get started with your workspace</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Join As</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="admin">Company Admin (Register Company)</option>
                <option value="user">Team Member (Employee)</option>
                <option value="guest">Guest User</option>
              </select>
            </div>

            <div className="form-divider"></div>

            {/* Common Fields */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
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

            {/* Admin-specific fields */}
            {formData.role === 'admin' && (
              <>
                <div className="form-section-title">Company Details</div>
                
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-input"
                    placeholder="Your Company Ltd."
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registration Number *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    className="form-input"
                    placeholder="REG-123456"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Email</label>
                  <input
                    type="email"
                    name="companyEmail"
                    className="form-input"
                    placeholder="contact@company.com"
                    value={formData.companyEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Phone</label>
                  <input
                    type="tel"
                    name="companyPhone"
                    className="form-input"
                    placeholder="+1 234 567 8900"
                    value={formData.companyPhone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* User-specific fields */}
            {formData.role === 'user' && (
              <>
                <div className="form-section-title">Employment Details</div>
                
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    name="workingCompany"
                    className="form-input"
                    placeholder="Your Company Ltd."
                    value={formData.workingCompany}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    className="form-input"
                    placeholder="EMP-12345"
                    value={formData.employeeId}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <input
                    type="text"
                    name="department"
                    className="form-input"
                    placeholder="Engineering, Marketing, etc."
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Manager's Email</label>
                  <input
                    type="email"
                    name="managerEmail"
                    className="form-input"
                    placeholder="manager@company.com"
                    value={formData.managerEmail}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Guest info */}
            {formData.role === 'guest' && (
              <div className="info-box">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>As a guest, you can report issues and track them without company details.</span>
              </div>
            )}

            <div className="form-divider"></div>

            {/* Password fields */}
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the Terms & Conditions</span>
              </label>
            </div>

            <button type="submit" className="btn-submit">
              Create Account
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          <div className="auth-footer">
            <p className="footer-text">
              Already have an account? <Link to="/login" className="footer-link">Sign in</Link>
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

export default Signup
