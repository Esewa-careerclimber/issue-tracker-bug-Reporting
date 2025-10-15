import React from 'react';
import './DashboardPage.css';
import { StatCards } from './StatCards';
import { Kanban } from './Kanban';

export function DashboardPage(){
  return (
    <div className="dashboardPage">
      <div className="dashboardHeader">
        <div className="headerLeft">
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="headerRight">
          <div className="dateFilter">
            <button className="dateFilterBtn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Last 30 days
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <StatCards />
      <Kanban />
      <div className="recentActivity">
        <div className="sectionHeader">
          <h2>Recent Activity</h2>
          <button className="viewAllBtn">View All</button>
        </div>
        <div className="activityList">
          <div className="activityItem">
            <div className="activityIcon update">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <div className="activityContent">
              <div className="activityTitle">Alex updated <span className="highlight">Auth flow refactor</span></div>
              <div className="activityTime">2 hours ago</div>
            </div>
          </div>
          <div className="activityItem">
            <div className="activityIcon comment">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="activityContent">
              <div className="activityTitle">Jamie commented on <span className="highlight">Rate limit spike</span></div>
              <div className="activityTime">5 hours ago</div>
            </div>
          </div>
          <div className="activityItem">
            <div className="activityIcon create">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="activityContent">
              <div className="activityTitle">Taylor created <span className="highlight">Improve logging middleware</span></div>
              <div className="activityTime">Yesterday at 4:30 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
