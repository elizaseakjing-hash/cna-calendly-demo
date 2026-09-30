import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import '../css/styles.css';
import { dbClear, dbGet, dbGetAll, dbPut, dbDelete, dbCount } from '../js/db.js';

// Expose the local IndexedDB helpers on window so the E2E test suite can
// reset the database between runs (mirrors the previous global db API).
if (typeof window !== 'undefined') {
  Object.assign(window, { dbClear, dbGet, dbGetAll, dbPut, dbDelete, dbCount });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
