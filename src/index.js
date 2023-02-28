import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import './index.css';


// main app component to support single-page app set up
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MemoryRouter>
    <App/>
  </MemoryRouter>
);