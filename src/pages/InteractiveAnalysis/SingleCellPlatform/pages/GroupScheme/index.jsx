import { useState, useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';
import { Table, Button, Modal, Form, Input, Checkbox, Space, message } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { GroupApi } from '@/services/api';
import styles from './index.module.css';

const GroupScheme = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [currentGroupDetail, setCurrentGroupDetail] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tableData, setTableData] = useState([
    { key: 1, projectName: 'myDemo', oldSampleName: 'POST1', newSampleName: 'POST1', groupName: 'POST', includeAnalysis: true },
    { key: 2, projectName: 'myDemo', oldSampleName: 'PRE1', newSampleName: 'PRE1', groupName: 'PRE', includeAnalysis: true },
  ]);

  const pageSize = 10;

  // 获取分组列表
  const fetchGroupList = async (page = 1, key = '') => {
    setLoading(true);
    try {
      const response = await GroupApi.postGroupSchemeIndex({ page, limit: pageSize, key });
      
      if (response.status === 1) {
        setListData(response.result?.group || []);
        setTotal(response.result?.count || 0);
      } else {
        message.error(response.msg || '获取分组列表失败');
      }
    } catch (error) {
      console.error('获取分组列表失败:', error);
      message.error('获取分组列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取任务列表
  const fetchTaskLists = async () => {
    try {
      const response = await GroupApi.getTaskLists();
      
      if (response.status === 1) {
        const taskList = (response.result?.group || []).map(task => ({
          id: task.task_id,
          name: task.task_number || task.task_name,
          status: task.task_status === 'C' ? 'success' : 
                  task.task_status === 'E' ? 'failed' : 
                  task.task_status === 'R' ? 'running' : 'pending',
          createTime: task.task_time,
          finishTime: task.task_finish,
          progress: task.task_status === 'R' ? 50 : undefined,
          errorMessage: task.task_status === 'E' ? '任务执行失败' : undefined,
        }));
        setTasks(taskList);
      } else {
        console.error('获取任务列表失败:', response.msg);
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  };

  // 查看分组详情
  const handleViewDetail = async (id) => {
    try {
      const response = await GroupApi.postGroupCheck({ id });
      
      if (response.status === 1) {
        setCurrentGroupDetail(response.result);
        setIsModalVisible(true);
      } else {
        message.error(response.msg || '获取分组详情失败');
      }
    } catch (error) {
      console.error('获取分组详情失败:', error);
      message.error('获取分组详情失败');
    }
  };

  // 搜索处理
  const handleSearch = () => {
    fetchGroupList(1, searchKeyword);
    setCurrentPage(1);
  };

  // 创建分组方案
  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  // 提交创建表单
  const handleSubmitCreate = async () => {
    try {
      const values = await form.validateFields();
      
      const submitData = {
        name: values.name,
        samples: tableData.map(item => ({
          projectName: item.projectName,
          oldSampleName: item.oldSampleName,
          newSampleName: item.newSampleName,
          groupName: item.groupName,
          includeAnalysis: item.includeAnalysis
        }))
      };
      
      const response = await GroupApi.postCreateGroupScheme(submitData);
      
      if (response.status === 1) {
        message.success('创建成功');
        setIsCreateModalVisible(false);
        form.resetFields();
        setTableData([
          { key: 1, projectName: 'myDemo', oldSampleName: 'POST1', newSampleName: 'POST1', groupName: 'POST', includeAnalysis: true },
          { key: 2, projectName: 'myDemo', oldSampleName: 'PRE1', newSampleName: 'PRE1', groupName: 'PRE', includeAnalysis: true },
        ]);
        fetchGroupList(currentPage, searchKeyword);
      } else {
        message.error(response.msg || '创建失败');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('请检查输入信息');
      } else {
        console.error('创建失败:', error);
        message.error('创建失败');
      }
    }
  };

  // 处理表格数据变化
  const handleTableChange = (key, field, value) => {
    setTableData(prev => prev.map(item => 
      item.key === key ? { ...item, [field]: value } : item
    ));
  };

  // 调整顺序
  const handleAdjustOrder = (newSampleName) => {
    message.info(`调整顺序: ${newSampleName}`);
  };

  useEffect(() => {
    fetchGroupList();
    fetchTaskLists();
  }, []);

  // 分组列表表格列
  const columns = [
    {
      title: '分组方案名称',
      dataIndex: 'group',
      key: 'group',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'group_time',
      key: 'group_time',
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            shape="circle" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.group_id)}
          />
          <Button 
            danger
            shape="circle" 
            icon={<DeleteOutlined />}
            onClick={() => message.info('删除功能待实现')}
          />
        </Space>
      ),
    },
  ];

  // 创建表单中的表格列
  const createTableColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center',
      width: 150,
    },
    {
      title: '旧样本名称',
      dataIndex: 'oldSampleName',
      key: 'oldSampleName',
      align: 'center',
      width: 150,
    },
    {
      title: () => (
        <div>
          新样本名称 <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: 4 }} />
        </div>
      ),
      dataIndex: 'newSampleName',
      key: 'newSampleName',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Input 
            value={text}
            onChange={(e) => handleTableChange(record.key, 'newSampleName', e.target.value)}
            style={{ width: 120 }}
          />
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleAdjustOrder(text)}
          >
            调整顺序
          </Button>
        </div>
      ),
    },
    {
      title: () => (
        <div>
          分组名称 <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: 4 }} />
        </div>
      ),
      dataIndex: 'groupName',
      key: 'groupName',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <Input 
          value={text}
          onChange={(e) => handleTableChange(record.key, 'groupName', e.target.value)}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: () => (
        <div>
          是否加入分析 <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: 4 }} />
        </div>
      ),
      dataIndex: 'includeAnalysis',
      key: 'includeAnalysis',
      align: 'center',
      width: 150,
      render: (checked, record) => (
        <Checkbox 
          checked={checked}
          onChange={(e) => handleTableChange(record.key, 'includeAnalysis', e.target.checked)}
        />
      ),
    },
  ];

  return (
    <PageTemplate 
      pageTitle="分组方案设置"
      onInteractiveAnalysis={() => message.info('开始交互分析')}
      tasks={tasks}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
            className={styles.createBtn}
          >
            新建分组方案
          </Button>
          <div className={styles.searchBox}>
            <Input
              placeholder="请输入关键字"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
            />
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
          </div>
        </div>

        <div className={styles.tableTitle}>● 分组列表</div>

        <Table 
          dataSource={listData} 
          columns={columns} 
          rowKey="group_id"
          loading={loading}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page) => {
              setCurrentPage(page);
              fetchGroupList(page, searchKeyword);
            },
            itemRender: (page, type, originalElement) => {
              if (type === 'prev') return <a>‹</a>;
              if (type === 'next') return <a>›</a>;
              if (type === 'jump-prev') return <a>前往</a>;
              if (type === 'jump-next') return null;
              return originalElement;
            }
          }}
        />
      </div>

      {/* 查看详情模态框 */}
      <Modal
        title="分组方案详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentGroupDetail && (
          <div>
            <p><strong>分组名称：</strong>{currentGroupDetail.name}</p>
            <p><strong>创建时间：</strong>{currentGroupDetail.createTime}</p>
            
            <Table
              dataSource={currentGroupDetail.samples?.map((sample, index) => ({ 
                ...sample, 
                key: index 
              })) || []}
              columns={[
                {
                  title: '项目名称',
                  dataIndex: 'projectName',
                  key: 'projectName',
                },
                {
                  title: '旧样本名称',
                  dataIndex: 'oldName',
                  key: 'oldName',
                },
                {
                  title: '新样本名称',
                  dataIndex: 'newName',
                  key: 'newName',
                },
                {
                  title: '分组名称',
                  dataIndex: 'group',
                  key: 'group',
                },
                {
                  title: '是否加入分析',
                  dataIndex: 'include',
                  key: 'include',
                  render: (include) => (include ? '是' : '否'),
                },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Modal>

      {/* 创建表单模态框 */}
      <Modal
        title={<div className={styles.modalTitle}>● 分组数据</div>}
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={1200}
        className={styles.createModal}
      >
        <Form form={form} layout="vertical">
          <div className={styles.importSection}>
            <Button type="primary" icon={<PlusOutlined />}>
              表格导入导出
            </Button>
            <QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: 8 }} />
          </div>

          <Table
            dataSource={tableData}
            columns={createTableColumns}
            pagination={false}
            bordered
            className={styles.createTable}
          />

          <Form.Item
            name="name"
            label="分组方案名称"
            rules={[{ required: true, message: '请输入分组方案名称' }]}
            style={{ marginTop: 24 }}
          >
            <Input placeholder="请输入分组方案名称" style={{ width: 300 }} />
          </Form.Item>

          <div className={styles.modalFooter}>
            <Button type="primary" onClick={handleSubmitCreate}>
              提交
            </Button>
          </div>
        </Form>
      </Modal>
    </PageTemplate>
  );
};

export default GroupScheme;