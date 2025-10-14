import React from 'react';
import { useTheme } from '../ThemeProvider';
import './AppLayout.css';

export function AppLayout({sidebar, topbar, rightPanel, children}){
  return (
    <div className="appLayout">
      <aside className="appSidebar">{sidebar}</aside>
      <div className="mainRegion">
        <div className="topBarWrap">{topbar}</div>
        <div className="contentWrap">{children}</div>
      </div>
      {rightPanel && <aside className="rightPanel">{rightPanel}</aside>}
    </div>
  );
}

export function TopBar(){
  const { theme, toggle } = useTheme();
  return (
    <div className="topBar">
      <div className="tbLeft">
        <h1 className="tbTitle">Dashboard</h1>
      </div>
      <div className="tbRight">
        <button className="modeToggle" onClick={toggle}>{theme==='light'?'Dark':'Light'} mode</button>
      </div>
    </div>
  );
}

export function Sidebar(){
  return (
    <nav className="sideNav">
      <div className="brandRow">IssueTracker</div>
      <div className="navGroup">
        <span className="navLabel">Overview</span>
        <a className="navItem active" href="#">Dashboard</a>
        <a className="navItem" href="#">My Issues</a>
        <a className="navItem" href="#">Report Issue</a>
      </div>
      <div className="navGroup">
        <span className="navLabel">Projects</span>
        <a className="navItem" href="#">Project A</a>
        <a className="navItem" href="#">Project B</a>
      </div>
    </nav>
  );
}

export function RightPanel(){
  return (
    <div className="inboxPanel">
      <div className="panelHead">Inbox</div>
      <div className="inboxList">
        <div className="inboxItem">No messages</div>
      </div>
    </div>
  );
}
