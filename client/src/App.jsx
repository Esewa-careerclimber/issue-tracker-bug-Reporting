import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ReportIssuePage from './pages/ReportIssuePage';
import UserDashboard from './pages/UserDashboard';
import IssueDetailsPage from './pages/IssueDetailsPage';
import HomePage from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
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
            
            {/* Admin dashboard */}
            <Route 
              element={
                <ProtectedRoute adminOnly={true}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
            {/* Report Issue - accessible to all authenticated users */}
            <Route 
              path="/report" 
              element={
                <ProtectedRoute>
                  <ReportIssuePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Issue Details - accessible to all authenticated users */}
            <Route 
              path="/issue/:id" 
              element={
                <ProtectedRoute>
                  <IssueDetailsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;