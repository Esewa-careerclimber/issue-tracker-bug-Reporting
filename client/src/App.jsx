import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import MyIssuesPage from './pages/MyIssuesPage';
import ReportIssuePage from './pages/ReportIssuePage';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Landing page as main page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth pages without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User page - standalone without Layout */}
          <Route path="/user" element={<UserDashboard />} />
          
          {/* Admin/Dashboard pages with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-issues" element={<MyIssuesPage />} />
            <Route path="/report" element={<ReportIssuePage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;