import React from 'react';
import './Kanban.css';

// This would come from the backend in a real implementation
const sample = {
  backlog:[
    {id:1, title:'Auth flow refactor', priority:'high', assignee:'Alex', avatar:'👩‍💻'},
    {id:2, title:'Rate limit spike', priority:'medium', assignee:'Jamie', avatar:'👨‍💻'}
  ],
  todo:[
    {id:3, title:'Improve logging middleware', priority:'low', assignee:'Taylor', avatar:'🧑‍💻'}
  ],
  progress:[
    {id:4, title:'Upgrade dependencies', priority:'medium', assignee:'Morgan', avatar:'👩‍💻'},
    {id:5, title:'Dark mode polish', priority:'high', assignee:'Casey', avatar:'👨‍💻'}
  ],
  review:[
    {id:6, title:'Add unit tests', priority:'high', assignee:'Riley', avatar:'🧑‍💻'}
  ],
  done:[
    {id:7, title:'Fix CORS issue', priority:'critical', assignee:'Jordan', avatar:'👩‍💻'},
    {id:8, title:'Update documentation', priority:'medium', assignee:'Sam', avatar:'👨‍💻'}
  ]
};

const columns = [
  {key:'backlog', label:'Backlog', color: '#6366f1'},
  {key:'todo', label:'To Do', color: '#8b5cf6'},
  {key:'progress', label:'In Progress', color: '#ec4899'},
  {key:'review', label:'Review', color: '#f97316'},
  {key:'done', label:'Done', color: '#10b981'},
];

const priorityLabels = {
  critical: {label: 'Critical', color: '#ef4444'},
  high: {label: 'High', color: '#f97316'},
  medium: {label: 'Medium', color: '#eab308'},
  low: {label: 'Low', color: '#10b981'}
};

export function Kanban(){
  return (
    <div className="kanbanContainer">
      <div className="kanbanHeader">
        <h2>Task Board</h2>
        <div className="kanbanActions">
          <button className="iconBtn filterBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filter
          </button>
          <button className="iconBtn addBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Task
          </button>
        </div>
      </div>
      
      <div className="kanbanWrap">
        {columns.map(col => (
          <div key={col.key} className="kanbanCol">
            <div className="colHead" style={{borderTopColor: col.color}}>
              <span className="colLabel">{col.label}</span>
              <span className="count" style={{background: col.color}}>{sample[col.key].length}</span>
            </div>
            <div className="colBody">
              {sample[col.key].map(item => (
                <div key={item.id} className="ticket">
                  <div className="ticketHeader">
                    <span 
                      className="priorityTag"
                      style={{background: priorityLabels[item.priority].color}}
                    >
                      {priorityLabels[item.priority].label}
                    </span>
                    <div className="ticketActions">⋮</div>
                  </div>
                  <div className="ticketTitle">{item.title}</div>
                  <div className="ticketFooter">
                    <div className="assignee">
                      <span className="avatar">{item.avatar}</span>
                      <span className="assigneeName">{item.assignee}</span>
                    </div>
                    <div className="ticketId">#{item.id}</div>
                  </div>
                </div>
              ))}
              <button className="addCardBtn">+ Add Card</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
