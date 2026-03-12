import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // Basic frontend validation for Gmail
    if (!values.email.toLowerCase().endsWith('@gmail.com')) {
      message.error('Registration is restricted to Gmail addresses only.');
      return;
    }

    setLoading(true);
    try {
      await client.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password
      });
      message.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      message.error(errorMsg);
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
          width: 450, 
          borderRadius: '24px', 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: '#8b5cf6', 
            borderRadius: '16px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin: '0 auto 16px',
            boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.4)'
          }}>
            <UserAddOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            Create Account
          </Title>
          <Text type="secondary">Sign up with your Gmail to get started</Text>
        </div>

        <Form
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input a username!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Username" 
              style={{ borderRadius: '12px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Gmail!' },
              { type: 'email', message: 'Please enter a valid email!' },
              {
                validator: (_, value) => {
                  if (value && !value.toLowerCase().endsWith('@gmail.com')) {
                    return Promise.reject(new Error('Only @gmail.com addresses are allowed'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />} 
              placeholder="Gmail Address" 
              style={{ borderRadius: '12px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Password"
              style={{ borderRadius: '12px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              icon={<UserAddOutlined />}
              style={{ 
                height: '48px', 
                borderRadius: '12px', 
                background: 'linear-gradient(to right, #8b5cf6, #d946ef)',
                border: 'none',
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#6366f1', fontWeight: 500 }}>
            <ArrowLeftOutlined /> Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
