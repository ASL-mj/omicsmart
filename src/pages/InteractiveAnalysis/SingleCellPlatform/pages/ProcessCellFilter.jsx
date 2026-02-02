import { Card, Table, Button, Space, Tag, Input, Select, Statistic, Row, Col, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './CellFilter.module.css';

const { Option } = Select;

const ProcessCellFilter = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // 模拟数据
  const cellData = [
    {
      key: '1',
      cellId: 'CELL_001',
      sample: 'Sample_A',
      cluster: 'Cluster_1',
      nGene: 2500,
      nUMI: 8000,
      mitoPct: 3.2,
      status: 'passed',
    },
    {
      key: '2',
      cellId: 'CELL_002',
      sample: 'Sample_A',
      cluster: 'Cluster_2',
      nGene: 1800,
      nUMI: 5500,
      mitoPct: 5.8,
      status: 'passed',
    },
    {
      key: '3',
      cellId: 'CELL_003',
      sample: 'Sample_B',
      cluster: 'Cluster_1',
      nGene: 3200,
      nUMI: 12000,
      mitoPct: 2.1,
      status: 'passed',
    },
    {
      key: '4',
      cellId: 'CELL_004',
      sample: 'Sample_B',
      cluster: 'Cluster_3',
      nGene: 800,
      nUMI: 2000,
      mitoPct: 15.5,
      status: 'filtered',
    },
    {
      key: '5',
      cellId: 'CELL_005',
      sample: 'Sample_C',
      cluster: 'Cluster_2',
      nGene: 2800,
      nUMI: 9500,
      mitoPct: 4.2,
      status: 'passed',
    },
  ];

  const columns = [
    {
      title: '细胞ID',
      dataIndex: 'cellId',
      key: 'cellId',
      fixed: 'left',
      width: 120,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.cellId.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: '样本',
      dataIndex: 'sample',
      key: 'sample',
      width: 120,
      filters: [
        { text: 'Sample_A', value: 'Sample_A' },
        { text: 'Sample_B', value: 'Sample_B' },
        { text: 'Sample_C', value: 'Sample_C' },
      ],
      onFilter: (value, record) => record.sample === value,
    },
    {
      title: '聚类',
      dataIndex: 'cluster',
      key: 'cluster',
      width: 120,
      filters: [
        { text: 'Cluster_1', value: 'Cluster_1' },
        { text: 'Cluster_2', value: 'Cluster_2' },
        { text: 'Cluster_3', value: 'Cluster_3' },
      ],
      onFilter: (value, record) => record.cluster === value,
    },
    {
      title: '基因数',
      dataIndex: 'nGene',
      key: 'nGene',
      width: 100,
      sorter: (a, b) => a.nGene - b.nGene,
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'UMI数',
      dataIndex: 'nUMI',
      key: 'nUMI',
      width: 100,
      sorter: (a, b) => a.nUMI - b.nUMI,
      render: (value) => value.toLocaleString(),
    },
    {
      title: '线粒体比例(%)',
      dataIndex: 'mitoPct',
      key: 'mitoPct',
      width: 130,
      sorter: (a, b) => a.mitoPct - b.mitoPct,
      render: (value) => (
        <span style={{ color: value > 10 ? '#ff4d4f' : '#52c41a' }}>
          {value.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right',
      filters: [
        { text: '通过', value: 'passed' },
        { text: '过滤', value: 'filtered' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'passed' ? 'success' : 'error'}>
          {status === 'passed' ? '通过' : '过滤'}
        </Tag>
      ),
    },
  ];

  const filteredData = filterStatus === 'all' 
    ? cellData 
    : cellData.filter(item => item.status === filterStatus);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleExport = () => {
    console.log('导出数据:', selectedRowKeys.length > 0 ? selectedRowKeys : '全部');
  };

  const handleReset = () => {
    setSelectedRowKeys([]);
    setSearchText('');
    setFilterStatus('all');
  };

  const passedCount = cellData.filter(item => item.status === 'passed').length;
  const filteredCount = cellData.filter(item => item.status === 'filtered').length;

  return (
    <div className={styles.cellFilter}>
      <Alert
        message="流程细胞集筛选"
        description="此页面展示经过质控流程后的细胞数据。您可以查看每个细胞的质控指标，并根据需要进行进一步筛选。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总细胞数"
              value={cellData.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="通过细胞数"
              value={passedCount}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="过滤细胞数"
              value={filteredCount}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="通过率"
              value={(passedCount / cellData.length * 100).toFixed(2)}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选工具栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Input
            placeholder="搜索细胞ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">全部状态</Option>
            <Option value="passed">仅通过</Option>
            <Option value="filtered">仅过滤</Option>
          </Select>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出数据 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            重置筛选
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 1000 }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default ProcessCellFilter;