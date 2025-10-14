import React from 'react';
import './DashboardPage.css';
import { StatCards } from './StatCards';
import { Kanban } from './Kanban';

export function DashboardPage(){
  return (
    <div className="dashboardPage">
      <StatCards />
      <Kanban />
    </div>
  );
}
