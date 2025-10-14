import React from 'react';
import './App.css';
import './theme/tokens.css';
import { ThemeProvider } from './components/ThemeProvider';
import { Dashboard } from './components/Dashboard';

function App(){
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;