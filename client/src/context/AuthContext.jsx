import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('digitway_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.auth.getMe();
        setAdmin(data.admin);
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('digitway_admin_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [token]);

  const requestOtp = async (email) => {
    return await api.auth.requestOtp(email);
  };

  const verifyOtp = async (email, otp) => {
    const data = await api.auth.verifyOtp(email, otp);
    if (data.success && data.token) {
      localStorage.setItem('digitway_admin_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('digitway_admin_token');
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = !!admin && !!token;

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated,
        loading,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
