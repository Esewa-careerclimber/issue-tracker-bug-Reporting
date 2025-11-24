import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
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
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing page as main page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Auth pages without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* User page - protected, standalone without Layout */}
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin/Dashboard pages with Layout - protected, admin only */}
            <Route 
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-issues" element={<MyIssuesPage />} />
              <Route path="/report" element={<ReportIssuePage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;