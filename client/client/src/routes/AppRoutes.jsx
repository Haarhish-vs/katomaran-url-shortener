import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

export default function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={<ProtectedRoute isAuthenticated={!!user}><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/analytics/:id"
          element={<ProtectedRoute isAuthenticated={!!user}><Analytics /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}
