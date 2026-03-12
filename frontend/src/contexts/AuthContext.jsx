import React, { useState } from 'react';
import client, { resolveReachableApiBaseUrl } from '../api/client';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username, password) => {
    const normalizedUsername = username?.trim();

    const executeLogin = async () => {
      const response = await client.post('/auth/login', { username: normalizedUsername, password });
      const { token, role, username: userName } = response.data;

      localStorage.setItem('token', token);
      const userData = { username: userName, role };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    };

    try {
      return await executeLogin();
    } catch (error) {
      if (!error?.response) {
        const resolvedBaseUrl = await resolveReachableApiBaseUrl();
        if (resolvedBaseUrl) {
          return await executeLogin();
        }
      }

      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};
