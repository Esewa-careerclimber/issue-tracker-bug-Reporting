import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = ({ size = 'medium', text = '', inline = false }) => {
  const sizeClass = `spinner-${size}`;
  
  if (inline) {
    return (
      <div className="loading-spinner-inline">
        <div className={`loading-spinner ${sizeClass}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        {text && <span className="loading-text-inline">{text}</span>}
      </div>
    );
  }
  
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export const InlineSpinner = () => {
  return (
    <div className="inline-spinner">
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
    </div>
  );
};

