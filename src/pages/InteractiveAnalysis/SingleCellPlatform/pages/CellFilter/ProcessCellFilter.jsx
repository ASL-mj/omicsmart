import { useState, useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import { 
  message, 
  Table, 
  Button, 
  Input, 
  Space, 
  Pagination, 
  Modal, 
  Form, 
  Select, 
  InputNumber, 
  Row, 
  Col,
  Card,
  Tooltip,
  Radio
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CloseOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import {  CellFilterApi } from '@/utils/api';

const { Option } = Select;

const ProcessCellFilter = () => {
  const [cellLists, setCellLists] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [genesList, setGenesList] = useState([]); // 新增：基因列表
  const [multiCellsLists, setMultiCellsLists] = useState([]); // 新增：多胞细胞列表
  const [multiCellsInfo, setMultiCellsInfo] = useState([]); // 新增：多胞细胞信息
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'view' | 'edit'
  const [multiCellsModalVisible, setMultiCellsModalVisible] = useState(false); // 新增：多胞细胞模态框
  const [form] = Form.useForm();
  const [umiCustomVisible, setUmiCustomVisible] = useState(false);
  const [mitochondrialCustomVisible, setMitochondrialCustomVisible] = useState(false);
  const [cellExtractionType, setCellExtractionType] = useState('不抽取');

  // 获取细胞列表
  const fetchCellLists = async (page = 1, pageSize = 10, keyword = '') => {
    setLoading(true);
    try {
      const response = await CellFilterApi.getCellLists({
        page,
        perPageNum: pageSize,
        keyWord: keyword,
      });

      if (response.status === 1) {
        setCellLists(response.result || []);
        setPagination({
          ...pagination,
          current: page,
          pageSize,
          total: response.total || 0,
        });
      } else {
        message.error('获取细胞列表失败: ' + (response.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取细胞列表失败:', error);
      message.error('获取细胞列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 获取分组名称列表
  const fetchGroupNames = async () => {
    try {
      const response = await CellFilterApi.getGroupNames({});
      if (response.status === 1) {
        setGroupNames(response.result || []);
      } else {
        console.error('获取分组名称失败:', response.msg);
      }
    } catch (error) {
      console.error('获取分组名称失败:', error);
    }
  };

  // 获取基因列表
  const fetchGenesList = async () => {
    try {
      const response = await CellFilterApi.getAllGenes({ keyword: '', limit: 100 }); // 获取所有基因
      if (response.status === 1) {
        setGenesList(response.list || []);
      } else {
        console.error('获取基因列表失败:', response.msg);
      }
    } catch (error) {
      console.error('获取基因列表失败:', error);
    }
  };

  // 获取多胞细胞列表
  const fetchMultiCellsLists = async () => {
    try {
      const response = await CellFilterApi.getMutilCellsLists();
      if (response.status === 1) {
        setMultiCellsLists(response.result || []);
      } else {
        console.error('获取多胞细胞列表失败:', response.msg);
      }
    } catch (error) {
      console.error('获取多胞细胞列表失败:', error);
    }
  };

  // 获取多胞细胞信息
  const fetchMultiCellsInfo = async () => {
    try {
      const response = await CellFilterApi.getMultiCellsInfo();
      if (response.status === 1) {
        setMultiCellsInfo(response.result || []);
      } else {
        console.error('获取多胞细胞信息失败:', response.msg);
      }
    } catch (error) {
      console.error('获取多胞细胞信息失败:', error);
    }
  };

  useEffect(() => {
    fetchCellLists();
    fetchGroupNames();
    fetchGenesList(); // 新增：获取基因列表
    fetchMultiCellsLists(); // 新增：获取多胞细胞列表
    fetchMultiCellsInfo(); // 新增：获取多胞细胞信息
  }, []);


  // 处理UMI单选变化
  const handleUmiRadioChange = (e) => {
    const value = e.target.value;
    setUmiCustomVisible(value === 'custom');
    form.setFieldsValue({ umiTotal: value });
  };

  // 处理线粒体比例单选变化
  const handleMitochondrialRadioChange = (e) => {
    const value = e.target.value;
    setMitochondrialCustomVisible(value === 'custom');
    form.setFieldsValue({ mitochondrialRatio: value });
  };

  // 处理细胞抽取单选变化
  const handleCellExtractionRadioChange = (e) => {
    const value = e.target.value;
    setCellExtractionType(value);
    form.setFieldsValue({ cellExtraction: value });
  };

  // 处理搜索
  const handleSearch = () => {
    fetchCellLists(1, pagination.pageSize, searchKeyword);
  };

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    fetchCellLists(page, pageSize, searchKeyword);
  };

  // 处理新建按钮点击
  const handleNewClick = () => {
    form.resetFields();
    setModalMode('add');
    setUmiCustomVisible(false);
    setMitochondrialCustomVisible(false);
    setCellExtractionType('不抽取');
    setModalVisible(true);
  };

  // 处理多胞细胞新增按钮点击
  const handleMultiCellsAddClick = () => {
    setMultiCellsModalVisible(true);
  };

  // 处理模态框关闭
  const handleModalClose = () => {
    setModalVisible(false);
    form.resetFields();
    setUmiCustomVisible(false);
    setMitochondrialCustomVisible(false);
    setCellExtractionType('不抽取');
  };

  // 处理多胞细胞模态框关闭
  const handleMultiCellsModalClose = () => {
    setMultiCellsModalVisible(false);
  };


  // 处理表单提交
  const handleFormSubmit = async () => {
    try {
      // 这里可以调用API创建新的细胞过滤列表
      message.success('细胞过滤列表创建成功！');
      setModalVisible(false);
      // 刷新列表
      fetchCellLists();
    } catch (error) {
      message.error('创建失败: ' + error.message);
    }
  };

  // 处理表格操作
  const handleView = async (record) => {
    try {
      setLoading(true);
      // 调用接口获取详情
      const response = await CellFilterApi.getListDetail({
        list_id: record.list_id,
      });

      if (response.status === 1 && response.result) {
        const detail = response.result;
        
        // 判断UMI是否为自定义
        const isUmiCustom = !['<1000', '<5000', '<10000'].includes(detail.umiTotal);
        setUmiCustomVisible(isUmiCustom);
        
        // 判断线粒体比例是否为自定义
        const isMitochondrialCustom = !['10%', '20%', '30%', '40%', '50%'].includes(detail.mitochondrialRatio);
        setMitochondrialCustomVisible(isMitochondrialCustom);
        
        // 设置细胞抽取类型
        const extractionType = detail.cellExtraction || '不抽取';
        setCellExtractionType(extractionType);
        
        // 将接口返回的数据回填到表单
        form.setFieldsValue({
          groupScheme: detail.group || record.group || '',
          tableName: detail.cell_list || record.cell_list || '',
          geneCountMin: detail.geneCountMin || 0,
          geneCountMax: detail.geneCountMax || 3000,
          umiTotal: isUmiCustom ? 'custom' : (detail.umiTotal || '<10000'),
          umiCustomMin: isUmiCustom ? detail.umiCustomMin : undefined,
          umiCustomMax: isUmiCustom ? detail.umiCustomMax : undefined,
          mitochondrialRatio: isMitochondrialCustom ? 'custom' : (detail.mitochondrialRatio || '10%'),
          mitochondrialCustom: isMitochondrialCustom ? detail.mitochondrialCustom : undefined,
          cellExtraction: extractionType,
          cellExtractionValue: extractionType === '固定值' ? detail.cellExtractionValue : undefined,
          targetGene: detail.targetGene || undefined,
          geneThreshold: detail.geneThreshold || undefined,
          multipletCellSet: detail.multipletCellSet || undefined,
        });
        
        setModalMode('view');
        setModalVisible(true);
      } else {
        message.error('获取详情失败: ' + (response.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取详情失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (record) => {
    try {
      setLoading(true);
      // 调用接口获取详情
      const response = await CellFilterApi.getListDetail({
        list_id: record.list_id,
      });

      if (response.status === 1 && response.result) {
        const detail = response.result;
        
        // 判断UMI是否为自定义
        const isUmiCustom = !['<1000', '<5000', '<10000'].includes(detail.umiTotal);
        setUmiCustomVisible(isUmiCustom);
        
        // 判断线粒体比例是否为自定义
        const isMitochondrialCustom = !['10%', '20%', '30%', '40%', '50%'].includes(detail.mitochondrialRatio);
        setMitochondrialCustomVisible(isMitochondrialCustom);
        
        // 设置细胞抽取类型
        const extractionType = detail.cellExtraction || '不抽取';
        setCellExtractionType(extractionType);
        
        // 将接口返回的数据回填到表单
        form.setFieldsValue({
          groupScheme: detail.group || record.group || '',
          tableName: detail.cell_list || record.cell_list || '',
          geneCountMin: detail.geneCountMin || 0,
          geneCountMax: detail.geneCountMax || 3000,
          umiTotal: isUmiCustom ? 'custom' : (detail.umiTotal || '<10000'),
          umiCustomMin: isUmiCustom ? detail.umiCustomMin : undefined,
          umiCustomMax: isUmiCustom ? detail.umiCustomMax : undefined,
          mitochondrialRatio: isMitochondrialCustom ? 'custom' : (detail.mitochondrialRatio || '10%'),
          mitochondrialCustom: isMitochondrialCustom ? detail.mitochondrialCustom : undefined,
          cellExtraction: extractionType,
          cellExtractionValue: extractionType === '固定值' ? detail.cellExtractionValue : undefined,
          targetGene: detail.targetGene || undefined,
          geneThreshold: detail.geneThreshold || undefined,
          multipletCellSet: detail.multipletCellSet || undefined,
        });
        
        setModalMode('edit');
        setModalVisible(true);
      } else {
        message.error('获取详情失败: ' + (response.msg || '未知错误'));
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      message.error('获取详情失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    message.info(`删除细胞集: ${record.cell_list}`);
    // 这里可以调用删除API
  };

  // 表格列定义
  const columns = [
    {
      title: '表格名称',
      dataIndex: 'cell_list',
      key: 'cell_list',
      width: 120,
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
      title: '分组方案名称',
      dataIndex: 'group',
      key: 'group',
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '未分组'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'list_time',
      key: 'list_time',
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
      title: '样本数目',
      dataIndex: 'sample_num',
      key: 'sample_num',
      width: 100,
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
      title: 'UMIS',
      dataIndex: 'umis',
      key: 'umis',
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
      title: 'Cells',
      dataIndex: 'cells',
      key: 'cells',
      width: 100,
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
      title: 'UMI/Cell',
      dataIndex: 'umi_cell',
      key: 'umi_cell',
      width: 100,
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
      title: '细胞饱和度',
      dataIndex: 'saturation',
      key: 'saturation',
      width: 120,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '0%'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '线粒体UMI比例',
      dataIndex: 'mitochondrial',
      key: 'mitochondrial',
      width: 140,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text || '0%'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '进度',
      dataIndex: 'finish',
      key: 'finish',
      width: 80,
      render: (text) => (
        <Tooltip title={text === '1' ? '已完成' : '进行中'}>
          <div style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}>
            {text === '1' ? '已完成' : '进行中'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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

  return (
    <PageTemplate
      pageTitle="流程细胞集筛选"
    >
      {/* 顶部操作栏 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNewClick}>
          新建
        </Button>
        <Space>
          <Input
            placeholder="搜索细胞集名称或分组方案"
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

      {/* 细胞集列表表格 */}
      <div style={{ marginBottom: 16 }}>
        <Table
          columns={columns}
          dataSource={cellLists}
          rowKey="list_id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1500 }}
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

      {/* 新增/查看/编辑细胞过滤列表模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {modalMode === 'add' ? '新增细胞过滤列表' : 
               modalMode === 'view' ? '查看细胞过滤列表' : 
               '编辑细胞过滤列表'}
            </span>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={handleModalClose}
              style={{ marginRight: -8 }}
            />
          </div>
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            groupScheme: 'qqq',
            geneCountMin: 0,
            geneCountMax: 3000,
            umiTotal: '<10000',
            mitochondrialRatio: '10%',
            cellExtraction: '不抽取',
          }}
        >
          <Card size="small" style={{ marginBottom: 16 }}>
            {/* 分组方案 */}
            <Form.Item
              label={
                <span>
                  分组方案
                  <Tooltip title="选择数据分组策略">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
              name="groupScheme"
              rules={[{ required: modalMode !== 'view', message: '请选择分组方案' }]}
            >
              <Select 
                placeholder="请选择分组方案" 
                loading={groupNames.length === 0}
                disabled={modalMode === 'view'}
              >
                {groupNames.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* 表格命名 */}
            <Form.Item
              label="表格命名"
              name="tableName"
              rules={[{ required: modalMode !== 'view', message: '请输入表格名称' }]}
            >
              <Input placeholder="请输入表格名称" disabled={modalMode === 'view'} />
            </Form.Item>
          </Card>

          <Card 
            title="选择过滤条件" 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={<span style={{ fontSize: 12, color: '#666' }}>共六项可配置的过滤规则</span>}
          >
            {/* 1. 单个细胞鉴定到gene数目 */}
            <Form.Item
              label={
                <span>
                  1. 单个细胞鉴定到gene数目
                  <Tooltip title="设定每个细胞检测到的基因数量范围">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="geneCountMin" noStyle>
                    <InputNumber 
                      min={0} 
                      max={10000} 
                      style={{ width: '100%' }} 
                      placeholder="最小值"
                      disabled={modalMode === 'view'}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="geneCountMax" noStyle>
                    <InputNumber 
                      min={0} 
                      max={10000} 
                      style={{ width: '100%' }} 
                      placeholder="最大值"
                      disabled={modalMode === 'view'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* 2. 单细胞中UMI总数小于 */}
            <Form.Item
              label={
                <span>
                  2. 单细胞中UMI总数小于
                  <Tooltip title="限制单个细胞的UMI（Unique Molecular Identifier）总数">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
              name="umiTotal"
            >
              <Radio.Group onChange={handleUmiRadioChange} disabled={modalMode === 'view'}>
                <Radio value="<1000">&lt;1000</Radio>
                <Radio value="<5000">&lt;5000</Radio>
                <Radio value="<10000">&lt;10000</Radio>
                <Radio value="custom">自定义</Radio>
              </Radio.Group>
              {umiCustomVisible && (
                <Row gutter={16} style={{ marginTop: 8 }}>
                  <Col span={12}>
                    <Form.Item name="umiCustomMin" noStyle>
                      <InputNumber 
                        min={0} 
                        max={100000} 
                        style={{ width: '100%' }} 
                        placeholder="最小值"
                        disabled={modalMode === 'view'}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="umiCustomMax" noStyle>
                      <InputNumber 
                        min={0} 
                        max={100000} 
                        style={{ width: '100%' }} 
                        placeholder="最大值"
                        disabled={modalMode === 'view'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Form.Item>

            {/* 3. 单细胞中UMI的线粒体基因表达量比例小于 */}
            <Form.Item
              label={
                <span>
                  3. 单细胞中UMI的线粒体基因表达量比例小于
                  <Tooltip title="控制线粒体基因在总UMI中的占比">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
              name="mitochondrialRatio"
            >
              <Radio.Group onChange={handleMitochondrialRadioChange} disabled={modalMode === 'view'}>
                <Radio value="10%">10%</Radio>
                <Radio value="20%">20%</Radio>
                <Radio value="30%">30%</Radio>
                <Radio value="40%">40%</Radio>
                <Radio value="50%">50%</Radio>
                <Radio value="custom">自定义</Radio>
              </Radio.Group>
              {mitochondrialCustomVisible && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                  <Form.Item name="mitochondrialCustom" noStyle>
                    <InputNumber 
                      min={0} 
                      max={100} 
                      style={{ width: 120 }} 
                      placeholder="输入数值"
                      disabled={modalMode === 'view'}
                    />
                  </Form.Item>
                  <span style={{ marginLeft: 8 }}>%</span>
                </div>
              )}
            </Form.Item>

            {/* 4. 细胞数目抽取 */}
            <Form.Item
              label={
                <span>
                  4. 细胞数目抽取
                  <Tooltip title="决定是否从样本中抽样">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
              name="cellExtraction"
            >
              <Radio.Group onChange={handleCellExtractionRadioChange} disabled={modalMode === 'view'}>
                <Radio value="不抽取">不抽取</Radio>
                <Radio value="样本最小值">样本最小值</Radio>
                <Radio value="固定值">固定值</Radio>
              </Radio.Group>
              {cellExtractionType === '固定值' && (
                <div style={{ marginTop: 8 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="cellExtractionValue" noStyle>
                        <InputNumber 
                          min={1} 
                          max={1000000} 
                          style={{ width: '100%' }} 
                          placeholder="输入固定值"
                          disabled={modalMode === 'view'}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <span style={{ fontSize: 12, color: '#999' }}>
                        小于固定值都保留，大于固定值抽到固定值
                      </span>
                    </Col>
                  </Row>
                </div>
              )}
            </Form.Item>

            {/* 5. 目标细胞过滤 */}
            <Form.Item
              label={
                <span>
                  5. 目标细胞过滤
                  <Tooltip title="基于特定基因的表达水平进行过滤，需选择基因并设定表达阈值">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
            >
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="targetGene" noStyle>
                    <Select 
                      mode="tags" 
                      placeholder="选择基因（可多选）" 
                      style={{ width: '100%' }}
                      loading={genesList.length === 0}
                      disabled={modalMode === 'view'}
                    >
                      {genesList.map(([geneId, geneName], index) => (
                        <Option key={index} value={geneId}>
                          {geneId}（{geneName}）
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="geneThreshold" noStyle>
                    <InputNumber 
                      min={0} 
                      max={1000} 
                      style={{ width: '100%' }} 
                      placeholder="阈值"
                      disabled={modalMode === 'view'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {/* 6. 多胞细胞集 */}
            <Form.Item
              label={
                <span>
                  6. 多胞细胞集
                  <Tooltip title="提供添加多胞细胞集合的选项">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
              name="multipletCellSet"
            >
              <Row gutter={16}>
                <Col span={18}>
                  <Select 
                    placeholder="请选择多胞细胞集" 
                    loading={multiCellsLists.length === 0}
                    disabled={modalMode === 'view'}
                  >
                    {multiCellsLists.map((cellSetName, index) => (
                      <Option key={index} value={cellSetName}>
                        {cellSetName}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Button 
                    type="primary" 
                    onClick={handleMultiCellsAddClick}
                    disabled={modalMode === 'view'}
                  >
                    新增
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Card>

          {/* 底部按钮 */}
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={handleModalClose} style={{ marginRight: 16 }}>
              {modalMode === 'view' ? '关闭' : '取消'}
            </Button>
            {modalMode !== 'view' && (
              <Button type="primary" htmlType="submit">
                确定并保存
              </Button>
            )}
          </div>
        </Form>
      </Modal>
      
      {/* 新增多胞细胞集模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>多胞细胞集信息</span>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={handleMultiCellsModalClose}
              style={{ marginRight: -8 }}
            />
          </div>
        }
        open={multiCellsModalVisible}
        onCancel={handleMultiCellsModalClose}
        footer={[
          <Button key="back" onClick={handleMultiCellsModalClose}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleMultiCellsModalClose}>确定</Button>,
        ]}
        width={800}
        centered
      >
        <Table
          columns={[
            {
              title: '样本',
              dataIndex: 'sample',
              key: 'sample',
            },
            {
              title: '比率',
              dataIndex: 'rate',
              key: 'rate',
            },
            {
              title: '数量',
              dataIndex: 'num',
              key: 'num',
            },
          ]}
          dataSource={multiCellsInfo}
          rowKey="sample"
          pagination={false}
        />
      </Modal>

    </PageTemplate>
  );
};

export default ProcessCellFilter;