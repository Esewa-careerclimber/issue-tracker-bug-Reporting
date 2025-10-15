import React from 'react';
import './StatCards.css';

// This would come from the backend in a real implementation
const data = [
  {
    label: 'Bug Reports',
    value: 47,
    color: 'red'
  },
  {
    label: 'Feature Requests',
    value: 23,
    color: 'green'
  },
  {
    label: 'Support Requests',
    value: 18,
    color: 'blue'
  },
  {
    label: 'General Feedback',
    value: 51,
    color: 'purple'
  },
];

export function StatCards(){
  return (
    <div className="statGrid">
      {data.map(card => (
        <div key={card.label} className={`statCard ${card.color}Card`}>
          <div className="statValue">{card.value}</div>
          <div className="statLabel">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
