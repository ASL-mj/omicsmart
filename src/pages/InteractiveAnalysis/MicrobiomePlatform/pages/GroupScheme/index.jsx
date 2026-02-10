import React, { useState } from 'react';
import { Button, Input, Table, Space, message, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate';
import styles from './index.module.css';

const { Search } = Input;

/**
 * 分组方案列表页面
 * 复刻自: https://www.omicsmart.com/16SNew/home.html#/group/list
 */
const GroupScheme = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // 模拟分组方案数据
  const [groupSchemes] = useState([
    { id: '54338', name: 'testaaaaccd', createTime: '2025-10-20 09:43:37' },
    { id: '54337', name: 'testaaaacc', createTime: '2025-10-20 09:43:20' },
    { id: '54001', name: 'testaaaa', createTime: '2025-09-26 10:06:04' },
    { id: '53456', name: '20250818', createTime: '2025-08-18 15:50:33' },
    { id: '52789', name: 'sun123', createTime: '2025-07-21 18:39:06' },
    { id: '51234', name: 'test_6_12', createTime: '2025-06-12 16:09:14' },
    { id: '48901', name: 'TTT', createTime: '2025-03-20 12:25:45' },
    { id: '45678', name: 'mmxx', createTime: '2024-08-02 14:29:33' },
    { id: '44567', name: 'gjl', createTime: '2024-07-04 15:03:49' },
    { id: '42345', name: 'AvB', createTime: '2024-03-23 22:39:03' },
  ]);

  // 处理查看
  const handleView = (record) => {
    navigate(`/interactive-analysis/microbiome/group-scheme/detail?id=${record.id}&mode=view`);
  };

  // 处理编辑
  const handleEdit = (record) => {
    navigate(`/interactive-analysis/microbiome/group-scheme/detail?id=${record.id}&mode=edit`);
  };

  // 处理删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除分组方案"${record.name}"吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  // 处理新建
  const handleCreate = () => {
    navigate('/interactive-analysis/microbiome/group-scheme/detail?mode=create');
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
  const handleSearch = (value) => {
    setSearchText(value);
    message.info(`搜索: ${value}`);
  };

  // 表格列定义
  const columns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '40%',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
    {
      title: '操 作',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            title="查看"
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            style={{ backgroundColor: '#52c41a', color: '#fff', borderColor: '#52c41a' }}
            onClick={() => handleEdit(record)}
            title="编辑"
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            title="删除"
          />
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = groupSchemes.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <PageTemplate pageTitle="分组方案">
      <div className={styles.groupSchemeContainer}>
        {/* 操作栏 */}
        <div className={styles.toolbar}>
          <div className={styles.leftActions}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              size="large"
            >
              新建分组方案
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className={styles.refreshBtn}
            >
              手动刷新
            </Button>
          </div>
          <div className={styles.rightActions}>
            <Search
              placeholder="搜索分组名称"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        </div>

        {/* 表格 */}
        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
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
          />
        </div>
      </div>
    </PageTemplate>
  );
};

export default GroupScheme;