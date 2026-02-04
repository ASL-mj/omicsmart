import { useState, useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import { 
  message, 
  Table, 
  Button, 
  Input, 
  Space, 
  Pagination, 
  Tooltip,
  Modal,
  Form,
  Select,
  Card,
  Checkbox,
  InputNumber,
  Row,
  Col,
  Spin
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  MinusCircleOutlined,
  MergeCellsOutlined
} from '@ant-design/icons';
import { TargetCellApi, CellFilterApi } from '@/utils/api';
import CellScatterChart from './Echarts/CellScatterChart.jsx';

const { confirm } = Modal;
const { Option } = Select;

const TargetCellFilter = () => {
  const [cellLists, setCellLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'view' | 'add' | 'merge' | 'batchCreate'
  const [selectedCellSets, setSelectedCellSets] = useState([]); // 选中的细胞集
  const [selectAllCellSets, setSelectAllCellSets] = useState(false); // 是否全选细胞集
  const [newMergedName, setNewMergedName] = useState(''); // 新合并细胞集名称
  const [form] = Form.useForm();
  const [taskOptions, setTaskOptions] = useState([]); // 任务选项
  const [graphOptions] = useState(['tsne', 'umap', 'pca']); // 图形类型选项
  const [geneSetScoreEnabled, setGeneSetScoreEnabled] = useState(true); // 基因集打分值筛选是否启用
  const [geneExpressionEnabled, setGeneExpressionEnabled] = useState(true); // 基因表达量筛选是否启用
  const [geneSetOptions] = useState(['GeneSet1', 'GeneSet2', 'GeneSet3']); // 基因集选项（示例）
  const [geneOptions, setGeneOptions] = useState([]); // 基因选项
  const [detailData, setDetailData] = useState(null); // 详细数据
  const [detailLoading, setDetailLoading] = useState(false); // 详细数据加载状态
  
  // 选择亚群/分支相关状态
  const [batchSelectEnabled, setBatchSelectEnabled] = useState(true); // 批量选择是否启用
  const [personalSelectEnabled, setPersonalSelectEnabled] = useState(false); // 个性化选择是否启用
  const [batchSelectType, setBatchSelectType] = useState('mark'); // 批量选择类型：mark-标记勾选，show-显示勾选
  const [sampleGroupType, setSampleGroupType] = useState('sample'); // 样本/分组类型：sample-样本，group-分组
  const [selectAllSubgroups, setSelectAllSubgroups] = useState(false); // 是否全选亚群
  const [selectAllSamples, setSelectAllSamples] = useState(false); // 是否全选样本
  const [selectedSamples, setSelectedSamples] = useState([]); // 已选择的样本

  // 批量创建细胞集相关状态
  const [batchCreateForm] = Form.useForm();
  const [batchSampleGroupType, setBatchSampleGroupType] = useState('sample'); // 样本/分组类型
  const [batchSelectAllSamples, setBatchSelectAllSamples] = useState(true); // 是否全选样本
  const [batchSelectedSamples, setBatchSelectedSamples] = useState(['POST1', 'PRE1']); // 已选择的样本
  const [clusterList, setClusterList] = useState([]); // 亚群列表
  const [selectedClusters, setSelectedClusters] = useState([]); // 选中的亚群
  const [clusterLoading, setClusterLoading] = useState(false); // 亚群加载状态


  // 获取目标细胞列表（用于表格展示，包含完整信息）
  const fetchTargetCellListsForTable = async (page = 1, pageSize = 10, keyword = '') => {
    setLoading(true);
    try {
      const response = await TargetCellApi.getTargetCellListDetails({
        page,
        perPageNum: pageSize,
        keyWord: keyword,
      });

      if (response.status === 1 && response.result) {
        setCellLists(response.result.lists || []);
        setPagination({
          ...pagination,
          current: page,
          pageSize,
          total: response.result.total || 0,
        });
      } else {
        message.error('获取目标细胞列表失败: ' + (response.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取目标细胞列表失败:', error);
      message.error('获取目标细胞列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 获取目标细胞列表（用于合并页面，简化信息）
  const fetchTargetCellListsForMerge = async () => {
    setLoading(true);
    try {
      const response = await TargetCellApi.getTargetCellLists({});

      if (response.status === 1 && response.result) {
        // getTargetCellLists 接口返回的数据直接在 result 数组中
        setCellLists(Array.isArray(response.result) ? response.result : []);
      } else {
        message.error('获取目标细胞列表失败: ' + (response.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取目标细胞列表失败:', error);
      message.error('获取目标细胞列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 获取任务列表（用于下拉框）
  const fetchTaskOptions = async () => {
    try {
      const response = await TargetCellApi.getTasksToQuasi();
      if (response.status === 1) {
        setTaskOptions(response.result || []);
      } else {
        console.error('获取任务列表失败:', response.msg);
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  };

  // 获取基因列表
  const fetchGeneOptions = async () => {
    try {
      const response = await CellFilterApi.getAllGenes({ keyword: '', limit: 1000 });
      if (response.status === 1) {
        setGeneOptions(response.list || []);
      } else {
        console.error('获取基因列表失败:', response.msg);
      }
    } catch (error) {
      console.error('获取基因列表失败:', error);
    }
  };

  useEffect(() => {
    fetchTargetCellListsForTable();
    fetchTaskOptions();
    fetchGeneOptions();
  }, []);

  // 处理搜索
  const handleSearch = () => {
    fetchTargetCellListsForTable(1, pagination.pageSize, searchKeyword);
  };

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    fetchTargetCellListsForTable(page, pageSize, searchKeyword);
  };

  // 处理新建按钮点击
  const handleNewClick = () => {
    form.resetFields();
    setViewMode('add');
  };

  // 处理合并细胞集按钮点击
  const handleMergeClick = () => {
    setViewMode('merge');
    setSelectedCellSets([]);
    setSelectAllCellSets(false);
    setNewMergedName('');
    // 切换到合并模式时，获取简化的细胞集列表
    fetchTargetCellListsForMerge();
  };

  // 处理批量创建细胞集按钮点击
  const handleBatchCreateClick = () => {
    setViewMode('batchCreate');
    batchCreateForm.resetFields();
    setBatchSampleGroupType('sample');
    setBatchSelectAllSamples(true);
    setBatchSelectedSamples(['POST1', 'PRE1']);
    setClusterList([]);
    setSelectedClusters([]);
  };


  // 获取亚群列表
  const fetchClusterList = async (taskNumber) => {
    if (!taskNumber) {
      message.warning('请先选择任务编号');
      return;
    }
    
    setClusterLoading(true);
    try {
      const response = await TargetCellApi.getClusterNamesList({
        taskNumber: taskNumber
      });

      if (response.status === 1 && response.result) {
        // 将数据转换为表格需要的格式，并默认全选
        const formattedData = response.result.map((item, index) => ({
          key: index,
          old: item.old,
          new: item.new,
          cellSetName: item.new, // 默认使用新亚群名称
        }));
        setClusterList(formattedData);
        setSelectedClusters(formattedData.map(item => item.key)); // 默认全选
      } else {
        message.error('获取亚群列表失败: ' + (response.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取亚群列表失败:', error);
      message.error('获取亚群列表失败: ' + error.message);
    } finally {
      setClusterLoading(false);
    }
  };

  // 处理任务编号变化
  const handleBatchTaskChange = (taskNumber) => {
    fetchClusterList(taskNumber);
  };

  // 处理亚群表格行选择
  const handleClusterRowSelection = {
    selectedRowKeys: selectedClusters,
    onChange: (selectedRowKeys) => {
      setSelectedClusters(selectedRowKeys);
    },
  };

  // 处理细胞集名称编辑
  const handleCellSetNameChange = (key, value) => {
    const newClusterList = clusterList.map(item => {
      if (item.key === key) {
        return { ...item, cellSetName: value };
      }
      return item;
    });
    setClusterList(newClusterList);
  };

  // 处理批量创建确认
  const handleBatchCreateConfirm = async () => {
    try {
      const values = await batchCreateForm.validateFields();
      
      if (selectedClusters.length === 0) {
        message.warning('请至少选择一个亚群');
        return;
      }

      // 获取选中的亚群数据
      const selectedClusterData = clusterList.filter(item => 
        selectedClusters.includes(item.key)
      );

      // 检查是否有空的细胞集名称
      const hasEmptyName = selectedClusterData.some(item => !item.cellSetName || !item.cellSetName.trim());
      if (hasEmptyName) {
        message.warning('请为所有选中的亚群填写细胞集名称');
        return;
      }

      console.log('批量创建细胞集参数:', {
        taskNumber: values.taskNumber,
        sampleGroupType: batchSampleGroupType,
        selectedSamples: batchSelectedSamples,
        clusters: selectedClusterData,
      });

      message.success(`已选择 ${selectedClusters.length} 个亚群进行批量创建`);
      // TODO: 调用批量创建API
      handleBackToList();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理查看
  const handleView = async (record) => {
    setViewMode('view');
    setDetailLoading(true);
    
    try {
      // 调用接口获取详细数据
      const response = await TargetCellApi.getTargetCellDetail({
        list_id: record.list_id
      });

      if (response.status === 1 && response.result) {
        setDetailData(response.result);
        
        // 解析 params 字段
        let params = {};
        try {
          params = typeof response.result.params === 'string' 
            ? JSON.parse(response.result.params) 
            : response.result.params || {};
        } catch (error) {
          console.error('解析参数失败:', error);
        }
        
        // 回填表单数据
        form.setFieldsValue({
          taskNumber: params.task_id || response.result.task_id || '',
          graphType: params.graph || '',
          cellSetName: response.result.list_name || '',
        });
      } else {
        message.error('获取详细数据失败: ' + (response.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取详细数据失败:', error);
      message.error('获取详细数据失败: ' + error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // 返回列表
  const handleBackToList = () => {
    setViewMode('list');
    form.resetFields();
    setDetailData(null);
    setGeneSetScoreEnabled(false);
    setGeneExpressionEnabled(false);
    // 重置选择亚群/分支相关状态
    setBatchSelectEnabled(true);
    setPersonalSelectEnabled(false);
    setBatchSelectType('mark');
    setSampleGroupType('sample');
    setSelectAllSubgroups(false);
    setSelectAllSamples(false);
    setSelectedSamples([]);
    // 重置合并相关状态
    setSelectedCellSets([]);
    setSelectAllCellSets(false);
    setNewMergedName('');
    // 重置批量创建相关状态
    batchCreateForm.resetFields();
    setBatchSampleGroupType('sample');
    setBatchSelectAllSamples(true);
    setBatchSelectedSamples(['POST1', 'PRE1']);
    setClusterList([]);
    setSelectedClusters([]);
  };

  // 处理细胞集卡片选择
  const handleCellSetSelect = (listId) => {
    if (selectedCellSets.includes(listId)) {
      setSelectedCellSets(selectedCellSets.filter(id => id !== listId));
      setSelectAllCellSets(false);
    } else {
      setSelectedCellSets([...selectedCellSets, listId]);
    }
  };

  // 处理全选细胞集
  const handleSelectAllCellSets = (checked) => {
    setSelectAllCellSets(checked);
    if (checked) {
      setSelectedCellSets(cellLists.map(item => item.list_id));
    } else {
      setSelectedCellSets([]);
    }
  };

  // 处理合并确认
  const handleMergeConfirm = () => {
    if (selectedCellSets.length < 2) {
      message.warning('请至少选择两个细胞集进行合并');
      return;
    }
    if (!newMergedName.trim()) {
      message.warning('请输入新细胞集名称');
      return;
    }
    
    // TODO: 调用合并API
    message.success(`已选择 ${selectedCellSets.length} 个细胞集进行合并，新名称：${newMergedName}`);
    handleBackToList();
  };

  // 处理删除
  const handleDelete = (record) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除细胞集"${record.list_name}"吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.success('删除成功');
        // TODO: 调用删除API
        fetchTargetCellListsForTable(pagination.current, pagination.pageSize, searchKeyword);
      },
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '细胞集名称',
      dataIndex: 'list_name',
      key: 'list_name',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '任务编号',
      dataIndex: 'task_number',
      key: 'task_number',
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '细胞数量',
      dataIndex: 'num',
      key: 'num',
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '0'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '空'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            size="small"
          >
          </Button>
        </Space>
      ),
    },
  ];

  // 渲染表单（查看/新增共用）
  const renderForm = () => {
    const isViewMode = viewMode === 'view';
    const title = isViewMode ? '查看目标细胞集' : '新增目标细胞集';
    
    return (
      <div>
        {/* 返回按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToList}
          >
            返回列表
          </Button>
        </div>


        {/* 表单 */}
        <Card title={title} style={{ maxWidth: 800 }}>
          <Form
            form={form}
            layout="vertical"
            disabled={isViewMode}
          >
            <Form.Item
              label="任务编号"
              name="taskNumber"
              rules={[{ required: true, message: '请选择任务编号' }]}
            >
              <Select placeholder="请选择任务编号">
                {taskOptions.map((task) => (
                  <Option key={task.task_id} value={task.task_id}>
                    {task.task_number || task.task_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="图形类型"
              name="graphType"
              rules={[{ required: true, message: '请选择图形类型' }]}
            >
              <Select placeholder="请选择图形类型">
                {graphOptions.map((graph) => (
                  <Option key={graph} value={graph}>
                    {graph.toUpperCase()}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="选择亚群/分支">
              <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                {/* 批量选择 */}
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16} align="middle">
                    <Col>
                      <Checkbox 
                        checked={batchSelectEnabled} 
                        onChange={(e) => setBatchSelectEnabled(e.target.checked)}
                        disabled={isViewMode}
                      >
                        批量选择
                      </Checkbox>
                    </Col>
                    <Col flex="auto">
                      <Select 
                        value={batchSelectType}
                        onChange={setBatchSelectType}
                        style={{ width: 250 }}
                        disabled={isViewMode || !batchSelectEnabled}
                      >
                        <Option value="mark">标记勾选的亚群/分支/样本/分组</Option>
                        <Option value="show">显示勾选的亚群/分支/样本/分组</Option>
                      </Select>
                    </Col>
                  </Row>
                </div>

                {batchSelectEnabled && (
                  <div style={{ paddingLeft: 24, marginBottom: 16 }}>
                    {/* 1. 选择亚群 */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>1. 选择亚群</div>
                      <Checkbox 
                        checked={selectAllSubgroups}
                        onChange={(e) => setSelectAllSubgroups(e.target.checked)}
                        disabled={isViewMode}
                      >
                        全选
                      </Checkbox>
                    </div>

                    {/* 2. 选择样本/分组 */}
                    <div>
                      <Row gutter={16} align="middle" style={{ marginBottom: 8 }}>
                        <Col>
                          <span style={{ fontWeight: 500 }}>2. 选择样本/分组</span>
                        </Col>
                        <Col>
                          <Select 
                            value={sampleGroupType}
                            onChange={setSampleGroupType}
                            style={{ width: 120 }}
                            disabled={isViewMode}
                          >
                            <Option value="sample">样本</Option>
                            <Option value="group">分组</Option>
                          </Select>
                        </Col>
                      </Row>
                      <div>
                        <Checkbox 
                          checked={selectAllSamples}
                          onChange={(e) => {
                            setSelectAllSamples(e.target.checked);
                            if (e.target.checked) {
                              setSelectedSamples(['POST1', 'PRE1']);
                            } else {
                              setSelectedSamples([]);
                            }
                          }}
                          disabled={isViewMode}
                          style={{ marginBottom: 8 }}
                        >
                          全选
                        </Checkbox>
                        <div style={{ paddingLeft: 24 }}>
                          <Checkbox 
                            checked={selectedSamples.includes('POST1')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSamples([...selectedSamples, 'POST1']);
                              } else {
                                setSelectedSamples(selectedSamples.filter(s => s !== 'POST1'));
                                setSelectAllSamples(false);
                              }
                            }}
                            disabled={isViewMode}
                            style={{ display: 'block', marginBottom: 8 }}
                          >
                            POST1
                          </Checkbox>
                          <Checkbox 
                            checked={selectedSamples.includes('PRE1')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSamples([...selectedSamples, 'PRE1']);
                              } else {
                                setSelectedSamples(selectedSamples.filter(s => s !== 'PRE1'));
                                setSelectAllSamples(false);
                              }
                            }}
                            disabled={isViewMode}
                            style={{ display: 'block' }}
                          >
                            PRE1
                          </Checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 个性化选择 */}
                <div>
                  <Checkbox 
                    checked={personalSelectEnabled} 
                    onChange={(e) => setPersonalSelectEnabled(e.target.checked)}
                    disabled={isViewMode}
                  >
                    个性化选择
                  </Checkbox>
                </div>

                <div style={{ paddingLeft: 24, marginTop: 16 }}>
                {/* 散点图 - 仅在查看模式下显示 */}
                {isViewMode && (
                  <CellScatterChart
                    data={detailData?.drawData?.list || []}
                    graphType={detailData?.drawData?.graph || ''}
                    loading={detailLoading}
                    height={600}
                    title="细胞亚群分布散点图"
                  />
                )}
                </div>
              </Card>
            </Form.Item>

            {/* 基因集打分值筛选 */}
            <Form.Item>
              <Checkbox 
                checked={geneSetScoreEnabled} 
                onChange={(e) => setGeneSetScoreEnabled(e.target.checked)}
                disabled={isViewMode}
              >
                基因集打分值筛选
              </Checkbox>
            </Form.Item>

            {geneSetScoreEnabled && (
              <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
                <Form.List name="geneSetScores" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.length > 1 && (
                        <Form.Item label="逻辑关系" style={{ marginBottom: 16 }}>
                          <Form.Item name="geneSetLogic" noStyle initialValue="and">
                            <Select style={{ width: 120 }} disabled={isViewMode}>
                              <Option value="and">AND</Option>
                              <Option value="or">OR</Option>
                            </Select>
                          </Form.Item>
                        </Form.Item>
                      )}
                      
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ marginBottom: 16 }}>
                          <Row gutter={16} align="middle">
                            <Col span={8}>
                              <Form.Item
                                {...field}
                                label={index === 0 ? "基因集" : ""}
                                name={[field.name, 'geneSet']}
                                rules={[{ required: true, message: '请选择基因集' }]}
                              >
                                <Select placeholder="请选择基因集" disabled={isViewMode}>
                                  {geneSetOptions.map((geneSet) => (
                                    <Option key={geneSet} value={geneSet}>
                                      {geneSet}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                label={index === 0 ? "最小值(%)" : ""}
                                name={[field.name, 'minScore']}
                                rules={[{ required: true, message: '请输入最小值' }]}
                              >
                                <InputNumber 
                                  min={0} 
                                  max={100} 
                                  style={{ width: '100%' }} 
                                  placeholder="最小值"
                                  disabled={isViewMode}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                label={index === 0 ? "最大值(%)" : ""}
                                name={[field.name, 'maxScore']}
                                rules={[{ required: true, message: '请输入最大值' }]}
                              >
                                <InputNumber 
                                  min={0} 
                                  max={100} 
                                  style={{ width: '100%' }} 
                                  placeholder="最大值"
                                  disabled={isViewMode}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              {index === 0 ? (
                                <Button 
                                  type="dashed" 
                                  onClick={() => add()} 
                                  icon={<PlusOutlined />}
                                  disabled={isViewMode}
                                  style={{ marginTop: index === 0 ? 30 : 0 }}
                                >
                                  新增
                                </Button>
                              ) : (
                                <Button
                                  type="link"
                                  danger
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => remove(field.name)}
                                  disabled={isViewMode}
                                >
                                  删除
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </Card>
            )}

            {/* 基因表达量筛选 */}
            <Form.Item>
              <Checkbox 
                checked={geneExpressionEnabled} 
                onChange={(e) => setGeneExpressionEnabled(e.target.checked)}
                disabled={isViewMode}
              >
                基因表达量筛选
              </Checkbox>
            </Form.Item>

            {geneExpressionEnabled && (
              <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
                <Form.List name="geneExpressions" initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.length > 1 && (
                        <Form.Item label="逻辑关系" style={{ marginBottom: 16 }}>
                          <Form.Item name="geneExpressionLogic" noStyle initialValue="and">
                            <Select style={{ width: 120 }} disabled={isViewMode}>
                              <Option value="and">AND</Option>
                              <Option value="or">OR</Option>
                            </Select>
                          </Form.Item>
                        </Form.Item>
                      )}
                      
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ marginBottom: 16 }}>
                          <Row gutter={16} align="middle">
                            <Col span={8}>
                              <Form.Item
                                {...field}
                                label={index === 0 ? "基因名称" : ""}
                                name={[field.name, 'geneName']}
                                rules={[{ required: true, message: '请选择基因名称' }]}
                              >
                                <Select 
                                  placeholder="请选择基因名称" 
                                  disabled={isViewMode}
                                  showSearch
                                  filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                  }
                                >
                                  {geneOptions.map(([geneId, geneName], idx) => (
                                    <Option key={idx} value={geneId}>
                                      {geneId}（{geneName}）
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                label={index === 0 ? "表达量最小值" : ""}
                                name={[field.name, 'minExpression']}
                                rules={[{ required: true, message: '请输入最小值' }]}
                              >
                                <InputNumber 
                                  min={0} 
                                  style={{ width: '100%' }} 
                                  placeholder="最小值"
                                  disabled={isViewMode}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                label={index === 0 ? "表达量最大值" : ""}
                                name={[field.name, 'maxExpression']}
                                rules={[{ required: true, message: '请输入最大值' }]}
                              >
                                <InputNumber 
                                  min={0} 
                                  style={{ width: '100%' }} 
                                  placeholder="最大值"
                                  disabled={isViewMode}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              {index === 0 ? (
                                <Button 
                                  type="dashed" 
                                  onClick={() => add()} 
                                  icon={<PlusOutlined />}
                                  disabled={isViewMode}
                                  style={{ marginTop: index === 0 ? 30 : 0 }}
                                >
                                  新增
                                </Button>
                              ) : (
                                <Button
                                  type="link"
                                  danger
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => remove(field.name)}
                                  disabled={isViewMode}
                                >
                                  删除
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </Card>
            )}

            <Form.Item
              label="新细胞集名称"
              name="cellSetName"
              rules={[{ required: true, message: '请输入新细胞集名称' }]}
            >
              <Input placeholder="请输入新细胞集名称" />
            </Form.Item>

            {/* 底部按钮 */}
            {!isViewMode && (
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    确定并保存
                  </Button>
                  <Button onClick={handleBackToList}>
                    取消
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Card>
      </div>
    );
  };

  // 渲染批量创建细胞集页面
  const renderBatchCreate = () => {
    // 亚群表格列定义
    const clusterColumns = [
      {
        title: '亚群名称',
        dataIndex: 'old',
        key: 'old',
        width: 150,
      },
      {
        title: '亚群新名称',
        dataIndex: 'new',
        key: 'new',
        width: 200,
      },
      {
        title: '细胞集名称',
        dataIndex: 'cellSetName',
        key: 'cellSetName',
        width: 250,
        render: (text, record) => (
          <Input
            value={text}
            onChange={(e) => handleCellSetNameChange(record.key, e.target.value)}
            placeholder="请输入细胞集名称"
          />
        ),
      },
    ];

    return (
      <div>
        {/* 返回按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToList}
          >
            返回列表
          </Button>
        </div>

        <Card title="批量创建细胞集" style={{ maxWidth: 1200 }}>
          <Form
            form={batchCreateForm}
            layout="vertical"
          >
            {/* 任务编号 */}
            <Form.Item
              label="任务编号"
              name="taskNumber"
              rules={[{ required: true, message: '请选择任务编号' }]}
            >
              <Select 
                placeholder="请选择任务编号"
                onChange={handleBatchTaskChange}
              >
                {taskOptions.map((task) => (
                  <Option key={task.task_id} value={task.task_id}>
                    {task.task_number || task.task_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* 1. 选择样本/分组 */}
            <Form.Item label="1. 选择样本/分组">
              <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
                  <Col>
                    <Select 
                      value={batchSampleGroupType}
                      onChange={setBatchSampleGroupType}
                      style={{ width: 120 }}
                    >
                      <Option value="sample">样本</Option>
                      <Option value="group">分组</Option>
                    </Select>
                  </Col>
                </Row>
                <div>
                  <Checkbox 
                    checked={batchSelectAllSamples}
                    onChange={(e) => {
                      setBatchSelectAllSamples(e.target.checked);
                      if (e.target.checked) {
                        setBatchSelectedSamples(['POST1', 'PRE1']);
                      } else {
                        setBatchSelectedSamples([]);
                      }
                    }}
                    style={{ marginBottom: 8 }}
                  >
                    全选（默认全选）
                  </Checkbox>
                  <div style={{ paddingLeft: 24 }}>
                    <Checkbox 
                      checked={batchSelectedSamples.includes('POST1')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBatchSelectedSamples([...batchSelectedSamples, 'POST1']);
                        } else {
                          setBatchSelectedSamples(batchSelectedSamples.filter(s => s !== 'POST1'));
                          setBatchSelectAllSamples(false);
                        }
                      }}
                      style={{ display: 'block', marginBottom: 8 }}
                    >
                      POST1
                    </Checkbox>
                    <Checkbox 
                      checked={batchSelectedSamples.includes('PRE1')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBatchSelectedSamples([...batchSelectedSamples, 'PRE1']);
                        } else {
                          setBatchSelectedSamples(batchSelectedSamples.filter(s => s !== 'PRE1'));
                          setBatchSelectAllSamples(false);
                        }
                      }}
                      style={{ display: 'block' }}
                    >
                      PRE1
                    </Checkbox>
                  </div>
                </div>
              </Card>
            </Form.Item>

            {/* 2. 选择亚群 */}
            <Form.Item label="2. 选择亚群">
              <Spin spinning={clusterLoading}>
                <Table
                  rowSelection={handleClusterRowSelection}
                  columns={clusterColumns}
                  dataSource={clusterList}
                  pagination={false}
                  locale={{ emptyText: '请先选择任务编号以加载亚群列表' }}
                  scroll={{ y: 400 }}
                />
              </Spin>
            </Form.Item>

            {/* 确认创建按钮 */}
            <Form.Item style={{ marginTop: 24, textAlign: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                onClick={handleBatchCreateConfirm}
                disabled={selectedClusters.length === 0}
              >
                确认创建
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  };

  // 渲染合并细胞集页面
  const renderMerge = () => {
    return (
      <div>
        {/* 返回按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackToList}
          >
            返回列表
          </Button>
        </div>

        {/* 标题和全选 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>合并细胞集</h2>
          <Checkbox 
            checked={selectAllCellSets}
            onChange={(e) => handleSelectAllCellSets(e.target.checked)}
          >
            全选
          </Checkbox>
        </div>

        {/* 已选择提示 */}
        {selectedCellSets.length > 0 && (
          <div style={{ marginBottom: 16, padding: '8px 16px', background: '#e6f7ff', borderRadius: 4 }}>
            已选择 {selectedCellSets.length} 个细胞集
          </div>
        )}

        {/* 细胞集卡片列表 */}
        <Spin spinning={loading}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {cellLists.map((item) => (
              <Col key={item.list_id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{
                    border: selectedCellSets.includes(item.list_id) ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCellSetSelect(item.list_id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <Tooltip title={item.list_name}>
                        <h4 style={{ 
                          margin: '0 0 8px 0', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.list_name}
                        </h4>
                      </Tooltip>
                      <p style={{ margin: '4px 0', fontSize: 12, color: '#999' }}>
                        {item.create_time || '-'}
                      </p>
                    </div>
                    <Checkbox 
                      checked={selectedCellSets.includes(item.list_id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleCellSetSelect(item.list_id)}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>

        {/* 新细胞集名称输入 */}
        <Card style={{ marginBottom: 16 }}>
          <Form layout="vertical">
            <Form.Item 
              label="新细胞集名称" 
              required
              style={{ marginBottom: 0 }}
            >
              <Input 
                placeholder="请输入合并后的新细胞集名称"
                value={newMergedName}
                onChange={(e) => setNewMergedName(e.target.value)}
                size="large"
              />
            </Form.Item>
          </Form>
        </Card>

        {/* 确定按钮 */}
        <div style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={handleMergeConfirm}
            disabled={selectedCellSets.length < 2 || !newMergedName.trim()}
          >
            确定合并
          </Button>
        </div>
      </div>
    );
  };

  // 渲染列表
  const renderList = () => {
    return (
      <>
        {/* 顶部操作栏 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNewClick}>
              新建
            </Button>
            <Button icon={<MergeCellsOutlined />} onClick={handleMergeClick}>
              合并细胞集
            </Button>
            <Button icon={<PlusOutlined />} onClick={handleBatchCreateClick}>
              批量创建细胞集
            </Button>
          </Space>
          <Space>
            <Input
              placeholder="搜索细胞集名称或任务编号"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ width: 300 }}
              onPressEnter={handleSearch}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
          </Space>
        </div>

        {/* 目标细胞集列表表格 */}
        <div style={{ marginBottom: 16 }}>
          <Table
            columns={columns}
            dataSource={cellLists}
            rowKey="list_id"
            loading={loading}
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </div>

        {/* 分页 */}
        <div style={{ textAlign: 'right' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
          />
        </div>
      </>
    );
  };

  // 根据视图模式渲染不同内容
  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return renderList();
      case 'merge':
        return renderMerge();
      case 'batchCreate':
        return renderBatchCreate();
      default:
        return renderForm();
    }
  };

  return (
    <PageTemplate
      pageTitle="目标细胞集筛选"
    >
      {renderContent()}
    </PageTemplate>
  );
};

export default TargetCellFilter;