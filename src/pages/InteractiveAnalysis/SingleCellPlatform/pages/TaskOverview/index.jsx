import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Tooltip } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import { TaskApi } from '@/utils/api';
import styles from './index.module.css';

// 任务类型到页面key的映射（使用hash路由）
const TASK_TYPE_PAGE_KEY_MAP = {
  '细胞质控总览': 'cell-qc-overview',
  '细胞频率统计': 'cell-frequency-stats',
  '分类t-SNE图': 'classification-tsne',
  '分类UMAP图': 'classification-umap',
  '细胞频率差异': 'cell-frequency-diff',
  '亚群marker基因分析': 'subgroup-marker-analysis',
  '亚群上调统计柱状图': 'upregulated-stats-bar',
  '亚群上调基因分布': 'upregulated-gene-distribution',
  '上调差异基因GO富集': 'upregulated-go-enrichment',
  '上调差异基因KEGG富集': 'upregulated-kegg-enrichment',
  '细胞注释分析': 'cell-annotation-analysis',
  '细胞轨迹图': 'monocle2-trajectory',
  '拟时间轴差异基因': 'monocle2-pseudotime-deg',
  '分化状态差异基因': 'monocle2-state-deg',
  '分化命运差异基因': 'monocle2-fate-deg',
  'Monocle2映射图': 'monocle2-mapping',
  'Monocle3降维图': 'monocle3-dimension-reduction',
  '拟时间值轨迹图': 'monocle3-pseudotime-trajectory',
  'Monocle3映射图': 'monocle3-mapping',
  '分化散点图': 'paga-scatter',
  '分化网络图': 'paga-network',
  '特征基因可视化': 'paga-feature-visualization',
  'Slingshot降维图': 'slingshot-dimension-reduction',
  '拟时间映射图': 'slingshot-mapping',
  '分化评估': 'cytotrace-differentiation-assessment',
  '分化水平映射图': 'cytotrace-differentiation-mapping',
  '细胞互作分析': 'cell-interaction-analysis',
  '配受体对分析': 'ligand-receptor-pair-analysis',
  '基因集细胞对互作': 'gene-set-cell-pair-interaction',
  '基因集配受体对互作': 'gene-set-ligand-receptor-interaction',
  '细胞对水平差异': 'cell-pair-level-diff',
  '配受体对水平差异': 'ligand-receptor-level-diff',
  '基因集水平差异': 'gene-set-level-diff',
  'TF-gene统计': 'tf-gene-stats',
  'Regulons活性降维': 'regulons-activity-dimension-reduction',
  'Regulons活性特征': 'regulons-activity-feature',
  'Regulons开放性特征': 'regulons-openness-feature',
  'Regulons表达量特征': 'regulons-expression-feature',
  'TF-gene互作网络': 'tf-gene-interaction-network',
  '差异基因统计': 'deg-stats',
  '差异基因分布': 'deg-distribution',
  '差异基因GO富集': 'deg-go-enrichment',
  '差异基因KEGG富集': 'deg-kegg-enrichment',
  'GSEA分析': 'gsea-analysis',
  '基因集分类': 'gene-set-classification',
  '阳性细胞分析': 'positive-cell-analysis',
  '基因集评估': 'gene-set-assessment',
  '基因集中基因分布': 'gene-distribution-in-set',
  '基因集评分差异': 'gene-set-score-diff',
  '目标基因韦恩图': 'target-gene-venn',
  '目标基因GO富集': 'target-gene-go-enrichment',
  '目标基因KEGG富集': 'target-gene-kegg-enrichment',
  'TCGA分析': 'tcga-analysis',
  '亚群类任务': 'subgroup-task',
  '组间差异任务': 'group-diff-task',
};

const TaskOverview = () => {
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取任务列表
  const fetchTaskList = async () => {
    setLoading(true);
    try {
      const response = await TaskApi.getTaskLists();
      
      if (response.status === 1) {
        const tasks = response.result?.group || [];
        
        // 处理任务数据
        const processedTasks = tasks.map((task, index) => {
          // 从task_type字段获取分析项目，按顿号分隔
          let analysisTypes = [];
          if (task.task_type && typeof task.task_type === 'string') {
            analysisTypes = task.task_type.split('、').filter(item => item.trim());
          }

          // 解析task_params获取分组方案
          let groupScheme = task.group || '-';
          if (task.task_params) {
            try {
              const params = JSON.parse(task.task_params);
              groupScheme = params.group || task.group || '-';
            } catch (e) {
              console.error('解析task_params失败:', e);
            }
          }

          return {
            key: task.task_id || index,
            taskId: task.task_id,
            taskNumber: task.task_number || task.task_name,
            groupScheme: groupScheme,
            clusterInfo: task.set || '-',
            analysisContent: task.is_classify || '-',
            analysisTypes: analysisTypes,
            startTime: task.task_time || '-',
            endTime: task.task_finish || '-',
            status: task.task_status || 'P',
            remark: task.task_remark || '-',
            taskType: task.task_type || '-',
          };
        });

        setTaskList(processedTasks);
        setPagination(prev => ({
          ...prev,
          total: processedTasks.length,
        }));
      } else {
        message.error(response.msg || '获取任务列表失败');
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
      message.error('获取任务列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchTaskList();
  }, []);

  // 状态标签渲染
  const renderStatus = (status) => {
    const statusMap = {
      'C': { color: 'success', text: '已完成' },
      'R': { color: 'processing', text: '运行中' },
      'E': { color: 'error', text: '失败' },
      'P': { color: 'default', text: '待运行' },
      'W': { color: 'warning', text: '等待中' },
    };

    const statusInfo = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // 分析项目渲染（可点击的标签）
  const renderAnalysisTypes = (types, record) => {
    if (!types || types.length === 0) {
      return <span style={{ color: '#999' }}>暂无</span>;
    }

    return (
      <Space size={[4, 4]} wrap>
        {types.map((type, index) => (
          <Tag 
            key={index}
            color="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => handleAnalysisTypeClick(type, record)}
          >
            {type}
          </Tag>
        ))}
      </Space>
    );
  };

  // 处理分析项目点击 - 使用hash路由跳转
  const handleAnalysisTypeClick = (type, record) => {
    const pageKey = TASK_TYPE_PAGE_KEY_MAP[type];
    if (pageKey) {
      // 使用sessionStorage临时存储任务信息，包括taskId用于自动选择任务编号
      sessionStorage.setItem('selectedTaskId', record.taskId);
      sessionStorage.setItem('selectedTaskNumber', record.taskNumber);
      // 使用hash路由跳转
      window.location.hash = `#${pageKey}`;
    } else {
      message.warning(`未找到"${type}"对应的页面`);
    }
  };

  // 查看任务详情 - 跳转到第一个分析项目页面
  const handleView = (record) => {
    if (record.analysisTypes && record.analysisTypes.length > 0) {
      const firstType = record.analysisTypes[0];
      handleAnalysisTypeClick(firstType, record);
    } else {
      message.warning('该任务没有可查看的分析项目');
    }
  };

  // 下载任务结果
  const handleDownload = (record) => {
    message.success(`开始下载任务 ${record.taskNumber} 的结果`);
    // TODO: 实现下载逻辑
  };

  // 删除任务
  const handleDelete = async (record) => {
    message.success(`任务 ${record.taskNumber} 已删除`);
    // TODO: 调用删除API
    // 刷新列表
    fetchTaskList();
  };

  // 表格列配置
  const columns = [
    {
      title: '任务编号',
      dataIndex: 'taskNumber',
      key: 'taskNumber',
      width: 150,
      fixed: 'left',
      render: (text) => (
        <Tooltip title={text}>
          <span className={styles.taskNumber}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '分组方案',
      dataIndex: 'groupScheme',
      key: 'groupScheme',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '集群信息',
      dataIndex: 'clusterInfo',
      key: 'clusterInfo',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '分析内容',
      dataIndex: 'analysisContent',
      key: 'analysisContent',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '分析项目',
      dataIndex: 'analysisTypes',
      key: 'analysisTypes',
      width: 250,
      render: (types, record) => renderAnalysisTypes(types, record),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      sorter: (a, b) => {
        if (a.startTime === '-' || b.startTime === '-') return 0;
        return new Date(a.startTime) - new Date(b.startTime);
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
      sorter: (a, b) => {
        if (a.endTime === '-' || b.endTime === '-') return 0;
        return new Date(a.endTime) - new Date(b.endTime);
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: '已完成', value: 'C' },
        { text: '运行中', value: 'R' },
        { text: '失败', value: 'E' },
        { text: '待运行', value: 'P' },
        { text: '等待中', value: 'W' },
      ],
      onFilter: (value, record) => record.status === value,
      render: renderStatus,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            >
            </Button>
          </Tooltip>
          <Tooltip title="下载结果">
            <Button
              type="link"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
              disabled={record.status !== 'C'}
            >
            </Button>
          </Tooltip>
          <Popconfirm
            title="确定要删除这个任务吗？"
            description="删除后将无法恢复"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除任务">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理表格变化
  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return (
    <PageTemplate 
      pageTitle="任务总览"
      showButtons={false}
    >
      <div className={styles.container}>
        {/* 操作栏 */}
        <div className={styles.toolbar}>
          <Space>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchTaskList}
              loading={loading}
            >
              刷新列表
            </Button>
          </Space>
          <div className={styles.summary}>
            共 <span className={styles.count}>{taskList.length}</span> 个任务
          </div>
        </div>

        {/* 任务列表表格 */}
        <Table
          columns={columns}
          dataSource={taskList}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
          bordered
          size="middle"
          className={styles.taskTable}
        />
      </div>
    </PageTemplate>
  );
};

export default TaskOverview;