import React from 'react';
import './StatCards.css';

const data = [
  {label:'Open', value:42},
  {label:'In Progress', value:17},
  {label:'Review', value:6},
  {label:'Closed (7d)', value:25},
];

export function StatCards(){
  return (
    <div className="statGrid">
      {data.map(card => (
        <div key={card.label} className="statCard">
          <div className="statValue">{card.value}</div>
          <div className="statLabel">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
