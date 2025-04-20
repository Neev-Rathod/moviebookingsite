import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    return token && role ? { token, role } : null;
  });
  const navigate = useNavigate();
  const login = async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    const token = res.data.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('token', token);
    localStorage.setItem('role', payload.role);
    setUser({ token, role: payload.role });
    navigate(payload.role === 'admin' ? '/admin' : '/');
  };
  const signup = async (username, password) => {
    const res = await api.post('/api/auth/signup', { username, password });
    const token = res.data.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('token', token);
    localStorage.setItem('role', payload.role);
    setUser({ token, role: payload.role });
    navigate('/');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};