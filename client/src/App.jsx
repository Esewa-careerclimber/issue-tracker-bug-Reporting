import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import MyIssuesPage from './pages/MyIssuesPage';
import ReportIssuePage from './pages/ReportIssuePage';
import HomePage from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Landing page without Layout */}
          <Route path="/landing" element={<HomePage />} />
          
          {/* Auth pages without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* App pages with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/my-issues" element={<MyIssuesPage />} />
            <Route path="/report" element={<ReportIssuePage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;