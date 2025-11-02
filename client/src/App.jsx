import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import MyIssuesPage from './pages/MyIssuesPage';
import ReportIssuePage from './pages/ReportIssuePage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/my-issues" element={<MyIssuesPage />} />
            <Route path="/report" element={<ReportIssuePage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;