import React from 'react';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ImageMatchDashboard } from './components/ImageMatchDashboard';
import MyIssuesPage from './pages/MyIssuesPage.jsx';

function App() {
  return (
    <ThemeProvider>
      <ImageMatchDashboard />
      <MyIssuesPage/>
    </ThemeProvider>
  );
}

export default App;