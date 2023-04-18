import React from 'react';
import ErrorDisplay from './ErrorDisplay';
import Nav from './Nav';
import { ErrorProvider } from '../context/errorContext';

export default function Layout({ children }) {
  return (
    <ErrorProvider>
      <div id="main-view-container">
        <ErrorDisplay />
        <Nav />
        <main>{children}</main>
      </div>
    </ErrorProvider>
  );
}