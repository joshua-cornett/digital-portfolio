// src/index.jsx

// React imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
// Style imports
import './styles/index.css';
// Context imports
import { ContextWrapper, LocationProvider, DialogueProvider } from './contexts';
// Component imports
import App from './components/App';

const providers = [LocationProvider, DialogueProvider]; // Add or remove universal providers here ...

/**
 * Main entry point for the React application.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    {/** Nests the providers into a single wrapper */}
    <ContextWrapper providers={providers}>
      <App />
    </ContextWrapper>
  </Router>
);
