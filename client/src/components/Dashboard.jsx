import React from 'react';
import './Dashboard.css';
import { useTheme } from './ThemeProvider';

const statCards = [
  { label: 'OPEN', value: 42 },
  { label: 'IN PROGRESS', value: 17 },
  { label: 'REVIEW', value: 6 },
  { label: 'CLOSED (7D)', value: 25 },
];

const kanbanData = {
  backlog: [
    { id: 1, title: 'Auth flow refactor' },
    { id: 2, title: 'Rate limit spike' }
  ],
  todo: [
    { id: 3, title: 'Improve logging middleware' }
  ],
  inProgress: [
    { id: 4, title: 'Upgrade dependencies' },
    { id: 5, title: 'Dark mode polish' }
  ],
  review: [
    { id: 6, title: 'Add unit tests' }
  ],
  done: []
};

export function Dashboard() {
  const { theme, toggle } = useTheme();
  
  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo">IssueTracker</div>
        <nav>
          <div className="navSection">
            <div className="navLabel">OVERVIEW</div>
            <a href="#" className="navItem active">Dashboard</a>
            <a href="#" className="navItem">My Issues one</a>
            <a href="#" className="navItem">Report Issue</a>
          </div>
          
          <div className="navSection">
            <div className="navLabel">PROJECTS</div>
            <a href="#" className="navItem">Project A</a>
            <a href="#" className="navItem">Project B</a>
          </div>
        </nav>
      </div>
      
      <header className="header">
        <div className="pageTitle">Dashboard</div>
        <button className="darkModeBtn" onClick={toggle}>{theme === 'light' ? 'Dark' : 'Light'} mode</button>
      </header>
      
      <main className="content">
        <div className="statCards">
          {statCards.map((card, index) => (
            <div key={index} className="statCard">
              <div className="statValue">{card.value}</div>
              <div className="statLabel">{card.label}</div>
            </div>
          ))}
        </div>
        
        <div className="kanban">
          <div className="kanbanColumn">
            <div className="columnHeader">
              Backlog <span className="count">{kanbanData.backlog.length}</span>
            </div>
            <div className="columnItems">
              {kanbanData.backlog.map(item => (
                <div key={item.id} className="ticket">
                  {item.title}
                </div>
              ))}
            </div>
          </div>
          
          <div className="kanbanColumn">
            <div className="columnHeader">
              To Do <span className="count">{kanbanData.todo.length}</span>
            </div>
            <div className="columnItems">
              {kanbanData.todo.map(item => (
                <div key={item.id} className="ticket">
                  {item.title}
                </div>
              ))}
            </div>
          </div>
          
          <div className="kanbanColumn">
            <div className="columnHeader">
              In Progress <span className="count">{kanbanData.inProgress.length}</span>
            </div>
            <div className="columnItems">
              {kanbanData.inProgress.map(item => (
                <div key={item.id} className="ticket">
                  {item.title}
                </div>
              ))}
            </div>
          </div>
          
          <div className="kanbanColumn">
            <div className="columnHeader">
              Review <span className="count">{kanbanData.review.length}</span>
            </div>
            <div className="columnItems">
              {kanbanData.review.map(item => (
                <div key={item.id} className="ticket">
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <div className="inboxPanel">
        <div className="inboxHeader">Inbox</div>
        <div className="noMessages">No messages</div>
      </div>
    </div>
  );
}