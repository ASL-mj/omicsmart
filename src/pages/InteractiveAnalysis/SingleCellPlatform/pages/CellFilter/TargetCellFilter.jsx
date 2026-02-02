import { Card, Form, Input, InputNumber, Button, Space, Table, Tag, Alert, Row, Col, Slider, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined, FilterOutlined, SaveOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './index.module.css';

const TargetCellFilter = () => {
  const [form] = Form.useForm();
  const [filterRules, setFilterRules] = useState([
    { id: 1, field: 'nGene', operator: '>=', value: 200, enabled: true },
    { id: 2, field: 'nGene', operator: '<=', value: 5000, enabled: true },
    { id: 3, field: 'mitoPct', operator: '<', value: 10, enabled: true },
  ]);
  const [previewData, setPreviewData] = useState([]);

  // 模拟预览数据
  const mockPreviewData = [
    {
      key: '1',
      cellId: 'CELL_001',
      nGene: 2500,
      nUMI: 8000,
      mitoPct: 3.2,
      result: 'pass',
    },
    {
      key: '2',
      cellId: 'CELL_002',
      nGene: 1800,
      nUMI: 5500,
      mitoPct: 5.8,
      result: 'pass',
    },
    {
      key: '3',
      cellId: 'CELL_003',
      nGene: 150,
      nUMI: 500,
      mitoPct: 2.1,
      result: 'filtered',
      reason: 'nGene < 200',
    },
    {
      key: '4',
      cellId: 'CELL_004',
      nGene: 2800,
      nUMI: 9500,
      mitoPct: 12.5,
      result: 'filtered',
      reason: 'mitoPct >= 10',
    },
  ];

  const fieldOptions = [
    { label: '基因数 (nGene)', value: 'nGene' },
    { label: 'UMI数 (nUMI)', value: 'nUMI' },
    { label: '线粒体比例 (mitoPct)', value: 'mitoPct' },
  ];

  const operatorOptions = [
    { label: '大于 (>)', value: '>' },
    { label: '大于等于 (>=)', value: '>=' },
    { label: '小于 (<)', value: '<' },
    { label: '小于等于 (<=)', value: '<=' },
    { label: '等于 (=)', value: '=' },
  ];

  const addRule = () => {
    const newRule = {
      id: Date.now(),
      field: 'nGene',
      operator: '>=',
      value: 0,
      enabled: true,
    };
    setFilterRules([...filterRules, newRule]);
  };

  const deleteRule = (id) => {
    setFilterRules(filterRules.filter(rule => rule.id !== id));
  };

  const toggleRule = (id) => {
    setFilterRules(filterRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const updateRule = (id, field, value) => {
    setFilterRules(filterRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handlePreview = () => {
    setPreviewData(mockPreviewData);
  };

  const handleApply = () => {
    console.log('应用筛选规则:', filterRules.filter(r => r.enabled));
  };

  const columns = [
    {
      title: '细胞ID',
      dataIndex: 'cellId',
      key: 'cellId',
      width: 120,
    },
    {
      title: '基因数',
      dataIndex: 'nGene',
      key: 'nGene',
      width: 100,
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'UMI数',
      dataIndex: 'nUMI',
      key: 'nUMI',
      width: 100,
      render: (value) => value.toLocaleString(),
    },
    {
      title: '线粒体比例(%)',
      dataIndex: 'mitoPct',
      key: 'mitoPct',
      width: 130,
      render: (value) => `${value.toFixed(2)}%`,
    },
    {
      title: '筛选结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result) => (
        <Tag color={result === 'pass' ? 'success' : 'error'}>
          {result === 'pass' ? '通过' : '过滤'}
        </Tag>
      ),
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => reason || '-',
    },
  ];

  const passCount = previewData.filter(d => d.result === 'pass').length;
  const filterCount = previewData.filter(d => d.result === 'filtered').length;

  return (
    <div className={styles.cellFilter}>
      <Alert
        message="目标细胞集筛选"
        description="自定义筛选条件，对细胞进行精细化筛选。您可以添加多个筛选规则，系统会根据这些规则自动过滤细胞。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* 筛选规则配置 */}
      <Card title="筛选规则配置" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {filterRules.map((rule, index) => (
            <Card
              key={rule.id}
              size="small"
              className={styles.ruleCard}
              style={{ 
                background: rule.enabled ? '#fff' : '#f5f5f5',
                opacity: rule.enabled ? 1 : 0.6 
              }}
            >
              <Row gutter={16} align="middle">
                <Col flex="40px">
                  <Checkbox
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                  />
                </Col>
                <Col flex="auto">
                  <Space size="middle" wrap>
                    <span style={{ fontWeight: 500 }}>规则 {index + 1}:</span>
                    <Input.Group compact>
                      <Input
                        style={{ width: '150px' }}
                        value={rule.field}
                        onChange={(e) => updateRule(rule.id, 'field', e.target.value)}
                        placeholder="字段"
                      />
                      <Input
                        style={{ width: '100px' }}
                        value={rule.operator}
                        onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                        placeholder="操作符"
                      />
                      <InputNumber
                        style={{ width: '120px' }}
                        value={rule.value}
                        onChange={(value) => updateRule(rule.id, 'value', value)}
                        placeholder="值"
                      />
                    </Input.Group>
                  </Space>
                </Col>
                <Col flex="80px">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteRule(rule.id)}
                  >
                    删除
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addRule}
            block
          >
            添加筛选规则
          </Button>
        </Space>
      </Card>

      {/* 快速配置 */}
      <Card title="快速配置" style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="基因数范围">
                <Slider
                  range
                  min={0}
                  max={10000}
                  defaultValue={[200, 5000]}
                  marks={{
                    0: '0',
                    5000: '5000',
                    10000: '10000',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="UMI数范围">
                <Slider
                  range
                  min={0}
                  max={50000}
                  defaultValue={[500, 30000]}
                  marks={{
                    0: '0',
                    25000: '25K',
                    50000: '50K',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="线粒体比例上限(%)">
                <Slider
                  min={0}
                  max={50}
                  defaultValue={10}
                  marks={{
                    0: '0%',
                    10: '10%',
                    25: '25%',
                    50: '50%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 操作按钮 */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="middle">
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={handlePreview}
          >
            预览筛选结果
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleApply}
            disabled={previewData.length === 0}
          >
            应用筛选
          </Button>
        </Space>
      </Card>

      {/* 预览结果 */}
      {previewData.length > 0 && (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {previewData.length}
                  </div>
                  <div style={{ color: '#8c8c8c', marginTop: '8px' }}>总细胞数</div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {passCount}
                  </div>
                  <div style={{ color: '#8c8c8c', marginTop: '8px' }}>通过筛选</div>
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                    {filterCount}
                  </div>
                  <div style={{ color: '#8c8c8c', marginTop: '8px' }}>被过滤</div>
                </div>
              </Card>
            </Col>
          </Row>

          <Card title="预览结果">
            <Table
              columns={columns}
              dataSource={previewData}
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default TargetCellFilter;