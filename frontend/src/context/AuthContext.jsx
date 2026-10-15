import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wanderlust_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          setUser(res.user);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      } else {
        // By default on first load, auto-login as demo owner so user can immediately experience the app
        try {
          const res = await api.auth.demo('owner');
          localStorage.setItem('wanderlust_token', res.token);
          setToken(res.token);
          setUser(res.user);
        } catch (demoErr) {
          console.warn('Demo auto-login unavailable yet:', demoErr);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await api.auth.login(credentials);
    localStorage.setItem('wanderlust_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    localStorage.setItem('wanderlust_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('wanderlust_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role) => {
    try {
      const res = await api.auth.demo(role);
      localStorage.setItem('wanderlust_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      console.error('Demo switch error:', err);
      throw err;
    }
  };

  const isOwner = user?.role === 'owner' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        isOwner,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
