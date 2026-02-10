import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  Input,
  Space,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate';
import styles from './index.module.css';

/**
 * OTU筛选列表页面
 * 复刻自: https://www.omicsmart.com/16SNew/home.html#/filter/list
 */
const OTUFilter = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 模拟OTU表格数据
  const [otuTables] = useState([
    {
      key: '1',
      id: '67338',
      tableName: 'tset',
      groupSchemeName: 'testaaaaccd',
      createTime: '2025-12-03 15:53:43',
    },
    {
      key: '2',
      id: '67337',
      tableName: '20251203',
      groupSchemeName: '20250818',
      createTime: '2025-12-03 11:50:39',
    },
    {
      key: '3',
      id: '67336',
      tableName: 'testaaaaccd_default',
      groupSchemeName: 'testaaaaccd',
      createTime: '2025-10-20 09:43:40',
    },
    {
      key: '4',
      id: '67335',
      tableName: 'testaaaacc_default',
      groupSchemeName: 'testaaaacc',
      createTime: '2025-10-20 09:43:24',
    },
    {
      key: '5',
      id: '67334',
      tableName: 'testaaaa_default',
      groupSchemeName: 'testaaaa',
      createTime: '2025-09-26 10:06:09',
    },
  ]);

  // 表格列定义
  const columns = [
    {
      title: 'OTU表格名称',
      dataIndex: 'tableName',
      key: 'tableName',
      width: 200,
    },
    {
      title: '对应分组方案名称',
      dataIndex: 'groupSchemeName',
      key: 'groupSchemeName',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="查看集合"
          />
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="编辑集合"
          />
          <Popconfirm
            title="确定要删除这个OTU表格吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              title="删除集合"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理查看
  const handleView = (record) => {
    navigate(`/interactive-analysis/microbiome/otu-filter/detail?id=${record.id}&mode=view`);
  };

  // 处理编辑
  const handleEdit = (record) => {
    navigate(`/interactive-analysis/microbiome/otu-filter/detail?id=${record.id}&mode=edit`);
  };

  // 处理删除
  const handleDelete = (record) => {
    message.success(`已删除OTU表格: ${record.tableName}`);
  };

  // 处理新增
  const handleAdd = () => {
    navigate('/interactive-analysis/microbiome/otu-filter/new');
  };

  // 处理刷新
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('刷新成功');
    }, 500);
  };

  // 处理搜索
  const handleSearch = () => {
    console.log('搜索:', searchText);
  };

  // 下载OTU代表序列
  const handleDownloadFa = () => {
    message.info('正在下载OTU代表序列...');
  };

  // 下载OTU序列进化树
  const handleDownloadNwk = () => {
    message.info('正在下载OTU序列进化树...');
  };

  // 过滤数据
  const filteredData = otuTables.filter(item =>
    item.tableName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.groupSchemeName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <PageTemplate pageTitle="OTU筛选">
      <div className={styles.otuFilterContainer}>
        {/* 工具栏 */}
        <div className={styles.toolbar}>
          <div className={styles.leftActions}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增表格
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadFa}
            >
              下载OTU代表序列
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadNwk}
            >
              下载OTU序列进化树
            </Button>
          </div>
          <div className={styles.rightActions}>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              className={styles.refreshBtn}
            >
              手动刷新
            </Button>
            <Input.Search
              placeholder="请输入搜索内容"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 200 }}
              allowClear
            />
          </div>
        </div>

        {/* 数据表格 */}
        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            bordered
            size="middle"
          />
        </div>
      </div>
    </PageTemplate>
  );
};

export default OTUFilter;