import React, { useState } from 'react';
import './ReportIssuePage.css';

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'bug',
    priority: 'medium',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Send to backend
    alert('Issue reported successfully!');
    setFormData({
      title: '',
      type: 'bug',
      priority: 'medium',
      description: '',
      stepsToReproduce: '',
      expectedBehavior: '',
      actualBehavior: ''
    });
  };

  return (
    <div className="report-issue-page">
      <div className="report-header">
        <h1>Report an Issue</h1>
        <p>Help us improve by reporting bugs, requesting features, or providing feedback</p>
      </div>

      <form className="issue-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="title">Issue Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Issue Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="support">Support Request</option>
              <option value="feedback">General Feedback</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the issue"
              rows="4"
              required
            />
          </div>
        </div>

        {formData.type === 'bug' && (
          <>
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="stepsToReproduce">Steps to Reproduce</label>
                <textarea
                  id="stepsToReproduce"
                  name="stepsToReproduce"
                  value={formData.stepsToReproduce}
                  onChange={handleChange}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expectedBehavior">Expected Behavior</label>
                <textarea
                  id="expectedBehavior"
                  name="expectedBehavior"
                  value={formData.expectedBehavior}
                  onChange={handleChange}
                  placeholder="What should happen?"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="actualBehavior">Actual Behavior</label>
                <textarea
                  id="actualBehavior"
                  name="actualBehavior"
                  value={formData.actualBehavior}
                  onChange={handleChange}
                  placeholder="What actually happens?"
                  rows="3"
                />
              </div>
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Submit Issue
          </button>
        </div>
      </form>
    </div>
  );
}
