import React from 'react';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ImageMatchDashboard } from './components/ImageMatchDashboard';

function App() {
  return (
    <ThemeProvider>
      <ImageMatchDashboard />
    </ThemeProvider>
  );
}

export default App;