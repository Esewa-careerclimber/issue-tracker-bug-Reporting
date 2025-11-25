import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser && storedUser !== 'undefined') {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      
      // Backend returns { _id, username, email, role, token, company?, department? }
      const { token, ...userInfo } = data;
      
      console.log('AuthContext - Login response:', { token: token ? 'exists' : 'missing', userInfo });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setToken(token);
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData, isAdmin = false) => {
    try {
      console.log('AuthContext - Registering as:', isAdmin ? 'admin' : 'user');
      const data = isAdmin 
        ? await authAPI.registerAdmin(userData)
        : await authAPI.registerUser(userData);
      
      // Backend returns { _id, username, email, role, token, company?, department? }
      const { token, ...userInfo } = data;
      
      console.log('AuthContext - Registration response:', { token: token ? 'exists' : 'missing', userInfo });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setToken(token);
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('AuthContext - Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
