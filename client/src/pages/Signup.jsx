import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToastContext } from '../context/ToastContext'
import { LoadingSpinner } from '../components/LoadingSpinner'
import './Login.css'

const Signup = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { success, error: showError } = useToastContext()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    company: '',
    department: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match!'
      setError(errorMsg)
      showError(errorMsg)
      setLoading(false)
      return
    }

    // Validate required fields based on role
    if (formData.role === 'admin' && (!formData.company || !formData.department)) {
      const errorMsg = 'Please fill in company and department details!'
      setError(errorMsg)
      showError(errorMsg)
      setLoading(false)
      return
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }

      // Add role-specific fields
      if (formData.role === 'admin') {
        userData.company = formData.company
        userData.department = formData.department
      }

      const result = await register(userData, formData.role === 'admin')
      
      if (result.success) {
        console.log('Registration successful, user role:', result.user.role)
        success('Account created successfully!')
        setTimeout(() => {
          // Route based on role from backend
          const userRole = result.user.role
          console.log('Navigating based on role:', userRole)
          if (userRole === 'admin') {
            console.log('Redirecting to /dashboard')
            navigate('/dashboard')
          } else if (userRole === 'user') {
            console.log('Redirecting to /user')
            navigate('/user')
          } else {
            console.error('Unknown role:', userRole)
            navigate('/user') // Default fallback
          }
        }, 500)
      } else {
        const errorMsg = result.error || 'Registration failed. Please try again.'
        setError(errorMsg)
        showError(errorMsg)
      }
    } catch (err) {
      const errorMsg = 'An error occurred. Please try again.'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setLoading(false)
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

          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Join As</label>
              <div className="role-toggle">
                <button
                  type="button"
                  className={formData.role === 'admin' ? 'active' : ''}
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={formData.role === 'user' ? 'active' : ''}
                  onClick={() => setFormData({ ...formData, role: 'user', company: '', department: '' })}
                >
                  User
                </button>
              </div>
            </div>

            <div className="form-divider"></div>

            {/* Common Fields */}
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="johndoe"
                value={formData.username}
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
                    name="company"
                    className="form-input"
                    placeholder="Your Company Ltd."
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <input
                    type="text"
                    name="department"
                    className="form-input"
                    placeholder="Engineering, HR, etc."
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
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

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="small" inline={true} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
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
