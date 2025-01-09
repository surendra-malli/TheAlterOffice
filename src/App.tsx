import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound'; 
import { AuthProvider, ProtectedRoute } from './context/AuthContext'; 
// import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                {/* <Navbar /> */}
                <Home />
              </>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;