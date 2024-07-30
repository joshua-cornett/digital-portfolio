// index.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { ContextWrapper, LocationProvider, DialogueProvider } from './contexts';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import App from './components/App';

const providers = [LocationProvider, DialogueProvider]; // Add or remove universal providers here ...

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    {/** Nests the providers into a single wrapper */}
    <ContextWrapper providers={providers}>
      <App />
    </ContextWrapper>
  </Router>
);
