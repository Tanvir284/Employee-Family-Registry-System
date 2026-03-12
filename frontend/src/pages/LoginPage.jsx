import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('Welcome back!');
      navigate('/');
    } catch (error) {
      console.error(error);
      message.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <Card 
        style={{ 
          width: 400, 
          borderRadius: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: '#6366f1', 
            borderRadius: '16px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin: '0 auto 16px',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)'
          }}>
            <UserOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            Registry Portal
          </Title>
          <Text type="secondary">Enter your credentials to continue</Text>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Username" 
              style={{ borderRadius: '12px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Password"
              style={{ borderRadius: '12px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              icon={<LoginOutlined />}
              style={{ 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                border: 'none',
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Don't have an account? <Button type="link" onClick={() => navigate('/register')} style={{ padding: 0 }}>Register Here</Button>
          </Text>
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Internal Use Only • &copy; 2026 Admin Panel
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
