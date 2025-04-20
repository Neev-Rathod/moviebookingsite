import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import NavBar           from './components/NavBar';
import Login            from './components/Login';
import Signup           from './components/Signup';
import MovieList from './components/MovieList';
import AdminDashboard   from './components/AdminDashboard';
import History          from './components/History';
import SeatSelection    from './components/SeatSelection';

function PrivateRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  if (user===null)               return <Navigate to="/login" replace />;
  if (role && user.role!==role)  return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute role="user">
                <MovieList />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies/:id/book"
            element={
              <PrivateRoute role="user">
                <SeatSelection />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute role="user">
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
