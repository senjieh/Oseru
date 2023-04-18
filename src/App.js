import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './context/userContext';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dash from './pages/Dash';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';
import Layout from './components/Layout';

function App() {
  return (
    <div id="main-app">
      <UserContextProvider>
        <Layout>
          <Routes>
              <Route path='/signup' element={
                <Signup />
              }
              />
              <Route path='/signin' element={
                <Signin />
              }
              />
              <Route
                path='/dash'
                element={
                  <ProtectedRoute>
                    <Dash />
                  </ProtectedRoute>
                }
              />            
              <Route
                path='/'
                element={
                  <Home />
                }
              />
          </Routes>
        </Layout>
      </UserContextProvider>
    </div>
  );
}

export default App;