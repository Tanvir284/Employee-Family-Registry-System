import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Tag, Space, Typography, Table, Row, Col, Divider, message, Skeleton, Avatar } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  FilePdfOutlined, 
  UserOutlined, 
  HomeOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  IdcardOutlined,
  PhoneOutlined,
  BankOutlined,
  WalletOutlined
} from '@ant-design/icons';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await client.get(`/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error(error);
        message.error('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const downloadCv = async () => {
    try {
      const response = await client.get(`/reports/employee-cv/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV_${employee.name.replace(/\s/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CV Download Error:', error);
      message.error('Failed to generate CV');
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    return dayjs().diff(dayjs(dob), 'year');
  };

  if (loading) return (
    <div style={{ padding: '40px' }}>
      <Skeleton active avatar paragraph={{ rows: 10 }} />
    </div>
  );

  if (!employee) return <Title level={4}>Employee not found</Title>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space size="large">
          <Button 
            shape="circle" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)} 
            style={{ border: 'none', background: '#e2e8f0' }}
          />
          <div>
            <Title level={2} style={{ margin: 0, fontFamily: "'Outfit', sans-serif" }}>{employee.name}</Title>
            <Space split={<Divider type="vertical" />}>
              <Text type="secondary">{employee.department} Department</Text>
              <Text type="secondary">ID: {employee.id}</Text>
              <Tag color="green">Active</Tag>
            </Space>
          </div>
        </Space>
        
        <Space>
          <Button icon={<FilePdfOutlined />} onClick={downloadCv} size="large">Download CV</Button>
          {user?.role === 'Admin' && (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/employees/edit/${id}`)}
              size="large"
              style={{ background: 'linear-gradient(to right, #6366f1, #4f46e5)', border: 'none' }}
            >
              Edit Profile
            </Button>
          )}
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Space><UserOutlined style={{ color: '#6366f1' }} /> Personal Information</Space>} 
            bordered={false}
            style={{ marginBottom: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
          >
            <Descriptions column={2} bordered size="middle">
              <Descriptions.Item label={<Space><IdcardOutlined /> NID</Space>} span={2}>{employee.nid}</Descriptions.Item>
              <Descriptions.Item label={<Space><PhoneOutlined /> Phone</Space>} span={2}>{employee.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label={<Space><BankOutlined /> Dept</Space>}>{employee.department}</Descriptions.Item>
              <Descriptions.Item label={<Space><WalletOutlined /> Basic Salary</Space>}>{employee.basicSalary.toLocaleString()} ৳</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card 
            title={<Space><TeamOutlined style={{ color: '#10b981' }} /> Family & Dependents</Space>} 
            bordered={false}
            style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
          >
            <Title level={5}><HomeOutlined /> Spouse</Title>
            {employee.spouse ? (
              <Descriptions size="small" column={1} style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <Descriptions.Item label="Name">{employee.spouse.name}</Descriptions.Item>
                <Descriptions.Item label="NID">{employee.spouse.nid || 'N/A'}</Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">No spouse information recorded.</Text>
            )}

            <Divider />

            <Title level={5}><TeamOutlined /> Children ({employee.children?.length || 0})</Title>
            {employee.children && employee.children.length > 0 ? (
              <Table 
                dataSource={employee.children} 
                rowKey="id" 
                pagination={false}
                size="small"
                columns={[
                  { title: 'Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
                  { 
                    title: 'DOB', 
                    dataIndex: 'dateOfBirth', 
                    key: 'dateOfBirth',
                    render: (d) => dayjs(d).format('DD MMM YYYY')
                  },
                  { 
                    title: 'Age', 
                    key: 'age',
                    render: (_, r) => <Tag color="blue">{calculateAge(r.dateOfBirth)} yrs</Tag>
                  },
                ]}
              />
            ) : (
              <Text type="secondary">No children information recorded.</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            bordered={false} 
            style={{ borderRadius: '16px', background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ background: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />
              <Title level={4} style={{ color: 'white', margin: 0 }}>{employee.name}</Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{employee.department} Team</Text>
            </div>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ padding: '0 10px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Profile Strength</Text>
                  <Text style={{ color: 'white' }}>High</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Last Updated</Text>
                  <Text style={{ color: 'white' }}>Today</Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDetailPage;
