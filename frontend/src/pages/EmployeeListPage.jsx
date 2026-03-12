import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Card,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Select,
  InputNumber,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  TeamOutlined,
  BankOutlined,
  WalletOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../contexts/useAuth';
import { debounce } from 'lodash';

const { Title, Text } = Typography;

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState({ totalEmployees: 0, totalDepartments: 0, averageSalary: 0, topDepartment: 'N/A' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(undefined);
  const [salaryRange, setSalaryRange] = useState({ min: undefined, max: undefined });
  const [sorter, setSorter] = useState({ sortBy: 'name', sortDirection: 'asc' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async (overrides = {}) => {
    setLoading(true);
    try {
      const params = {
        page: overrides.page ?? pagination.current,
        pageSize: overrides.pageSize ?? pagination.pageSize,
        search,
        department,
        minSalary: salaryRange.min,
        maxSalary: salaryRange.max,
        sortBy: sorter.sortBy,
        sortDirection: sorter.sortDirection,
      };

      const response = await client.get('/employees', { params });
      setEmployees(response.data.items ?? []);
      setPagination(prev => ({
        ...prev,
        current: response.data.page,
        pageSize: response.data.pageSize,
        total: response.data.totalItems,
      }));
    } catch (error) {
      console.error(error);
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [pagination, search, department, salaryRange.min, salaryRange.max, sorter.sortBy, sorter.sortDirection]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await client.get('/employees/summary');
      setSummary(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees({ page: 1 });
    fetchSummary();
  }, [department, salaryRange.min, salaryRange.max, sorter.sortBy, sorter.sortDirection, fetchEmployees, fetchSummary]);

  const debouncedSearch = useMemo(
    () => debounce((value) => {
      setPagination(prev => ({ ...prev, current: 1 }));
      setSearch(value);
    }, 400),
    []
  );

  useEffect(() => {
    fetchEmployees({ page: 1 });
  }, [search, fetchEmployees]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleDelete = async (id) => {
    try {
      await client.delete(`/employees/${id}`);
      message.success('Employee deleted');
      fetchEmployees();
      fetchSummary();
    } catch (error) {
      console.error(error);
      message.error('Failed to delete employee');
    }
  };

  const downloadReport = async () => {
    try {
      const response = await client.get('/reports/employee-list', {
        params: { search },
        responseType: 'blob',
      });
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
      render: (text) => (
        <Space size="middle">
          <div style={{ padding: 8, background: '#eef2ff', borderRadius: 8 }}>
            <UserOutlined style={{ color: '#6366f1' }} />
          </div>
          <Text strong style={{ fontSize: 15 }}>{text}</Text>
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
      render: (tag) => <Tag color="blue">{tag}</Tag>,
    },
    {
      title: 'Salary',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
      render: (salary) => `৳ ${Number(salary).toLocaleString()}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/employees/${record.id}`)} type="text" style={{ color: '#6366f1' }} />
          {user?.role === 'Admin' && (
            <>
              <Button icon={<EditOutlined />} onClick={() => navigate(`/employees/edit/${record.id}`)} type="text" style={{ color: '#8b5cf6' }} />
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
    <div style={{ maxWidth: 1300, margin: '0 auto' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}><Statistic title="Total Employees" value={summary.totalEmployees} prefix={<TeamOutlined style={{ color: '#6366f1' }} />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}><Statistic title="Departments" value={summary.totalDepartments} prefix={<BankOutlined style={{ color: '#10b981' }} />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}><Statistic title="Average Salary" value={summary.averageSalary} prefix={<WalletOutlined style={{ color: '#f59e0b' }} />} suffix="৳" precision={2} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}><Statistic title="Top Department" value={summary.topDepartment} /></Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        title={<Title level={3} style={{ margin: 0 }}>Employee Directory</Title>}
        extra={(
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => { fetchEmployees(); fetchSummary(); }}>Refresh</Button>
            <Button icon={<FilePdfOutlined />} onClick={downloadReport}>Export PDF</Button>
            {user?.role === 'Admin' && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/employees/new')}>
                Add Employee
              </Button>
            )}
          </Space>
        )}
      >
        <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
          <Col xs={24} md={10}>
            <Input
              placeholder="Search by name, NID or department..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              onChange={(e) => debouncedSearch(e.target.value)}
              size="large"
            />
          </Col>
          <Col xs={24} md={5}>
            <Select
              allowClear
              size="large"
              placeholder="Department"
              style={{ width: '100%' }}
              value={department}
              onChange={setDepartment}
              options={[
                { label: 'IT', value: 'IT' },
                { label: 'HR', value: 'HR' },
                { label: 'Finance', value: 'Finance' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'Sales', value: 'Sales' },
                { label: 'Operations', value: 'Operations' },
                { label: 'Admin', value: 'Admin' },
              ]}
            />
          </Col>
          <Col xs={12} md={3}>
            <InputNumber
              size="large"
              min={0}
              style={{ width: '100%' }}
              value={salaryRange.min}
              onChange={(value) => setSalaryRange(prev => ({ ...prev, min: value ?? undefined }))}
              placeholder="Min ৳"
            />
          </Col>
          <Col xs={12} md={3}>
            <InputNumber
              size="large"
              min={0}
              style={{ width: '100%' }}
              value={salaryRange.max}
              onChange={(value) => setSalaryRange(prev => ({ ...prev, max: value ?? undefined }))}
              placeholder="Max ৳"
            />
          </Col>
          <Col xs={24} md={3}>
            <Select
              size="large"
              style={{ width: '100%' }}
              value={`${sorter.sortBy}:${sorter.sortDirection}`}
              onChange={(value) => {
                const [sortBy, sortDirection] = value.split(':');
                setSorter({ sortBy, sortDirection });
              }}
              options={[
                { label: 'Name (A-Z)', value: 'name:asc' },
                { label: 'Name (Z-A)', value: 'name:desc' },
                { label: 'Salary (Low-High)', value: 'salary:asc' },
                { label: 'Salary (High-Low)', value: 'salary:desc' },
              ]}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['8', '12', '20', '50'],
          }}
          onChange={(nextPagination) => {
            setPagination(prev => ({ ...prev, current: nextPagination.current, pageSize: nextPagination.pageSize }));
            fetchEmployees({ page: nextPagination.current, pageSize: nextPagination.pageSize });
          }}
        />
      </Card>
    </div>
  );
};

export default EmployeeListPage;
