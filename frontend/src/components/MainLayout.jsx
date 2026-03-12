import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Avatar, Space, Divider, Grid } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  DashboardOutlined,
  BulbOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const MainLayout = ({ isDarkMode, toggleTheme }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Overview</Link>,
    },
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: <Link to="/">Employee Directory</Link>,
    },
  ];

  const isMobile = !screens.lg;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        width={240}
      >
        <div style={{ padding: collapsed ? '20px 10px' : '24px 16px', textAlign: 'center' }}>
          <Title level={4} style={{ color: 'white', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
            {collapsed ? 'ER' : 'Registry Pro'}
          </Title>
          {!collapsed && (
            <Text style={{ color: 'rgba(255,255,255,.6)', fontSize: 12 }}>
              Workforce Operations
            </Text>
          )}
        </div>
        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '0 12px 20px' }} />
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>

      <Layout>
        <Header style={{
          padding: '0 16px 0 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isDarkMode ? '1px solid #262626' : '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Title level={5} style={{ margin: 0 }}>{location.pathname === '/' ? 'People Analytics' : 'Employee'}</Title>
          </Space>

          <Space size="middle">
            <Button icon={<BulbOutlined />} onClick={toggleTheme}>
              {isDarkMode ? 'Light' : 'Dark'}
            </Button>
            <Button type="text" icon={<BellOutlined />} />
            <Divider type="vertical" />
            <Space>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <Text strong style={{ lineHeight: 1.2 }}>{user?.username}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{user?.role}</Text>
              </div>
              <Avatar icon={<UserOutlined />} style={{ background: '#6366f1' }} />
              <Button icon={<LogoutOutlined />} onClick={logout} type="text" danger />
            </Space>
          </Space>
        </Header>

        <Content style={{ margin: isMobile ? 12 : 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
