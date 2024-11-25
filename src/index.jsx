import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.scss';
import { DialogueProvider } from '@contexts';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Main entry point for the React application.
 */
root.render(
  <Router>
    <DialogueProvider>
      <App />
    </DialogueProvider>
  </Router>
);
