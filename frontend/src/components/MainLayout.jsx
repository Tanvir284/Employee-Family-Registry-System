import React from 'react';
import { Layout, Menu, Button, Typography, Avatar, Space, Divider } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserOutlined, 
  TeamOutlined, 
  LogoutOutlined, 
  DashboardOutlined, 
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: <Link to="/">Employee List</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      disabled: true
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0"
        width={260}
        style={{ 
          background: '#0f172a',
          position: 'fixed',
          height: '100vh',
          left: 0,
          zIndex: 100
        }}
      >
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '8px', 
            background: 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '12px',
            marginBottom: '12px'
          }}>
            <TeamOutlined style={{ fontSize: '24px', color: '#6366f1' }} />
          </div>
          <Title level={4} style={{ color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            Registry Pro
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>Enterprise Management</Text>
        </div>
        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '0 24px 24px' }} />
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          style={{ padding: '0 12px' }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: 260 }}>
        <Header style={{ 
          background: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(8px)',
          padding: '0 32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          borderBottom: '1px solid #e2e8f0',
          height: '72px'
        }}>
          <Title level={5} style={{ margin: 0, color: '#64748b' }}>
            {location.pathname === '/' ? 'Employee Overview' : 'Management'}
          </Title>
          
          <Space size="large">
            <Button type="text" icon={<BellOutlined style={{ fontSize: '18px', color: '#64748b' }} />} />
            <Divider type="vertical" />
            <Space>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <Text strong style={{ fontSize: '14px', lineHeight: '1.2' }}>{user?.username}</Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>{user?.role}</Text>
              </div>
              <Avatar icon={<UserOutlined />} style={{ background: '#6366f1' }} />
              <Button 
                icon={<LogoutOutlined />} 
                onClick={logout} 
                type="text" 
                danger
              />
            </Space>
          </Space>
        </Header>
        
        <Content style={{ margin: '24px 32px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
