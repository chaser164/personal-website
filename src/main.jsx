import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Disable all scrolling
document.addEventListener('DOMContentLoaded', () => {
  // Prevent scroll events
  document.addEventListener('scroll', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, { passive: false });

  // Prevent wheel events (mouse wheel scrolling)
  document.addEventListener('wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, { passive: false });

  // Prevent touch events (mobile scrolling)
  document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, { passive: false });

  // Prevent keyboard scroll events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'PageUp' || e.key === 'PageDown' ||
        e.key === 'Home' || e.key === 'End' ||
        e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { passive: false });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
