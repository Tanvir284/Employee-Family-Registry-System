import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, Space, Divider, Typography, DatePicker, message, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined, UserOutlined, IdcardOutlined, PhoneOutlined, BankOutlined, WalletOutlined, TeamOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const EmployeeFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const response = await client.get(`/employees/${id}`);
          const data = response.data;
          const formattedData = {
            ...data,
            children: (data.children || []).map(c => ({
              ...c,
              dateOfBirth: c.dateOfBirth ? dayjs(c.dateOfBirth) : null
            }))
          };
          form.setFieldsValue(formattedData);
        } catch (error) {
          console.error(error);
          message.error('Failed to fetch employee details');
        } finally {
          setFetching(false);
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        children: (values.children || []).map(c => ({
          ...c,
          dateOfBirth: c.dateOfBirth ? c.dateOfBirth.toISOString() : null
        }))
      };

      if (isEdit) {
        await client.put(`/employees/${id}`, payload);
        message.success('Employee record updated');
      } else {
        await client.post('/employees', payload);
        message.success('New employee added successfully');
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ textAlign: 'center', padding: '100px' }}><Space direction="vertical"><Title level={4}>Loading Employee Data...</Title></Space></div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space size="middle">
          <Button 
            shape="circle" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)} 
            style={{ border: 'none', background: '#e2e8f0' }}
          />
          <div>
            <Title level={2} style={{ margin: 0, fontFamily: "'Outfit', sans-serif" }}>
              {isEdit ? 'Update Record' : 'Create Profile'}
            </Title>
            <Text type="secondary">{isEdit ? `Editing ID: ${id}` : 'Fill in the information below to register a new employee'}</Text>
          </div>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ children: [] }}
        requiredMark="optional"
      >
        <Card 
          bordered={false} 
          title={<Space><UserOutlined style={{ color: '#6366f1' }} /> Basic Information</Space>} 
          style={{ marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="John Doe" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                name="nid" 
                label="NID Number" 
                rules={[
                  { required: true },
                  { pattern: /^(\d{10}|\d{17})$/, message: 'NID must be 10 or 17 digits' }
                ]}
              >
                <Input prefix={<IdcardOutlined style={{ color: '#94a3b8' }} />} placeholder="10 or 17 digits" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                name="phoneNumber" 
                label="Phone Number" 
                rules={[
                  { required: true },
                  { pattern: /^(01|\+8801)\d{9}$/, message: 'Follow BD format (01XXXXXXXXX)' }
                ]}
              >
                <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="01XXXXXXXXX" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                <Input prefix={<BankOutlined style={{ color: '#94a3b8' }} />} placeholder="e.g. IT, HR" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item name="basicSalary" label="Salary (৳)" rules={[{ required: true }]}>
                <InputNumber prefix={<WalletOutlined style={{ color: '#94a3b8' }} />} style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card 
          bordered={false} 
          title={<Space><TeamOutlined style={{ color: '#ec4899' }} /> Spouse Details (Optional)</Space>} 
          style={{ marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name={['spouse', 'name']} label="Spouse Full Name">
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                name={['spouse', 'nid']} 
                label="Spouse NID"
                rules={[{ pattern: /^(\d{10}|\d{17})$/, message: 'NID must be 10 or 17 digits' }]}
              >
                <Input placeholder="Enter NID" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card 
          bordered={false} 
          title={<Space><PlusOutlined style={{ color: '#10b981' }} /> Children Information</Space>} 
          style={{ marginBottom: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
        >
          <Form.List name="children">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '16px', position: 'relative' }}>
                    <Row gutter={16}>
                      <Col xs={24} md={11}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label="Child Name"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Input placeholder="Enter child name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={11}>
                        <Form.Item
                          {...restField}
                          name={[name, 'dateOfBirth']}
                          label="Birth Date"
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={2} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '24px' }}>
                        <Button 
                          icon={<DeleteOutlined />} 
                          danger 
                          shape="circle" 
                          onClick={() => remove(name)} 
                          style={{ border: 'none', background: '#fee2e2' }}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ height: '50px', borderRadius: '12px' }}>
                    Add Child Entry
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <div style={{ padding: '24px', background: 'white', borderRadius: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px', position: 'sticky', bottom: '24px', boxShadow: '0 -10px 15px -3px rgba(0, 0, 0, 0.05)', zIndex: 10 }}>
          <Button size="large" onClick={() => navigate(-1)} style={{ borderRadius: '10px' }}>Cancel</Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            icon={<SaveOutlined />} 
            loading={loading}
            style={{ 
              borderRadius: '10px', 
              padding: '0 40px',
              background: 'linear-gradient(to right, #6366f1, #4f46e5)',
              border: 'none',
              height: '50px',
              fontWeight: 600
            }}
          >
            {isEdit ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeFormPage;
