import React from 'react';
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
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1', // Indigo
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
          colorBgContainer: '#ffffff',
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            bodyBg: '#f8fafc',
            siderBg: '#0f172a', // Slate 900
          },
          Button: {
            fontWeight: 600,
            borderRadius: 6,
          },
          Card: {
            borderRadiusLG: 12,
          }
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
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
