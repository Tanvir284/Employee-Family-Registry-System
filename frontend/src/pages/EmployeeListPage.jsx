import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Typography, Card, Tag, message, Popconfirm, Row, Col, Statistic } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, TeamOutlined, BankOutlined, WalletOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from 'lodash';

const { Title, Text } = Typography;

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await client.get(`/employees?search=${searchTerm}`);
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const debouncedSearch = debounce((value) => {
    fetchEmployees(value);
  }, 500);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/employees/${id}`);
      message.success('Employee deleted');
      fetchEmployees(search);
    } catch (error) {
      console.error(error);
      message.error('Failed to delete employee');
    }
  };

  const downloadReport = async () => {
    try {
      const response = await client.get('/reports/employee-list', { responseType: 'blob' });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EmployeeRoster_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF Export Error:', error);
      message.error('Failed to generate report');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px' }}>
            <UserOutlined style={{ color: '#6366f1' }} />
          </div>
          <Text strong style={{ fontSize: '15px' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'NID',
      dataIndex: 'nid',
      key: 'nid',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (tag) => {
        let color = '#6366f1';
        if (tag === 'IT') color = 'blue';
        if (tag === 'HR') color = 'magenta';
        return (
          <Tag color={color} style={{ borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
            {tag}
          </Tag>
        );
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/employees/${record.id}`)} 
            type="text"
            style={{ color: '#6366f1' }}
          />
          {user?.role === 'Admin' && (
            <>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/employees/edit/${record.id}`)} 
                type="text"
                style={{ color: '#8b5cf6' }}
              />
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                <Button icon={<DeleteOutlined />} type="text" danger />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} bodyStyle={{ padding: '24px' }}>
            <Statistic 
              title={<Text type="secondary">Total Employees</Text>}
              value={employees.length} 
              prefix={<TeamOutlined style={{ color: '#6366f1' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} bodyStyle={{ padding: '24px' }}>
            <Statistic 
              title={<Text type="secondary">Departments</Text>}
              value={new Set(employees.map(e => e.department)).size} 
              prefix={<BankOutlined style={{ color: '#10b981' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} bodyStyle={{ padding: '24px' }}>
            <Statistic 
              title={<Text type="secondary">Avg. Salary</Text>}
              value={Math.round(employees.reduce((acc, curr) => acc + curr.basicSalary, 0) / (employees.length || 1))} 
              prefix={<WalletOutlined style={{ color: '#f59e0b' }} />} 
              suffix="৳"
            />
          </Card>
        </Col>
      </Row>

      <Card 
        bordered={false}
        title={
          <Title level={3} style={{ margin: 0, padding: '16px 0', fontFamily: "'Outfit', sans-serif" }}>
            Employee Roster
          </Title>
        }
        extra={
          <Space>
            <Button icon={<FilePdfOutlined />} onClick={downloadReport}>Export PDF</Button>
            {user?.role === 'Admin' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => navigate('/employees/new')}
                style={{ background: 'linear-gradient(to right, #6366f1, #4f46e5)', border: 'none' }}
              >
                Add Employee
              </Button>
            )}
          </Space>
        }
      >
        <div style={{ marginBottom: '24px' }}>
          <Input
            placeholder="Search by name, NID or department..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={search}
            onChange={handleSearch}
            size="large"
            style={{ borderRadius: '12px', background: '#f8fafc' }}
          />
        </div>

        <Table 
          columns={columns} 
          dataSource={employees} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          style={{ borderTop: '1px solid #f1f5f9' }}
        />
      </Card>
    </div>
  );
};

export default EmployeeListPage;
