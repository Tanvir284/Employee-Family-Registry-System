import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const currentTheme = useMemo(() => ({
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#6366f1',
      borderRadius: 10,
      fontFamily: "'Inter', sans-serif",
    },
    components: {
      Layout: {
        headerBg: isDarkMode ? '#141414' : '#ffffff',
        bodyBg: isDarkMode ? '#0f0f0f' : '#f6f8fc',
        siderBg: isDarkMode ? '#09090b' : '#0f172a',
      }
    },
  }), [isDarkMode]);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <ConfigProvider theme={currentTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}>
                <Route path="/" element={<EmployeeListPage />} />
                <Route path="/employees/:id" element={<EmployeeDetailPage />} />

                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/employees/new" element={<EmployeeFormPage />} />
                  <Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
