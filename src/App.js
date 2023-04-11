import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './context/userContext';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dash from './pages/Dash';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <div id="main-app">
      <UserContextProvider>
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
                <ProtectedRoute>
                  <Dash />
                </ProtectedRoute>
              }
            />
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;