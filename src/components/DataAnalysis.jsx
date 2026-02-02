import { useState } from 'react';
import { Card, Row, Col, Select, Button, Table, Statistic, Space, Tabs } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const DataAnalysis = () => {
  const [loading, setLoading] = useState(false);

  // 示例数据
  const differentialData = [
    {
      key: '1',
      gene: 'BRCA1',
      logFC: 2.5,
      pValue: 0.001,
      adjPValue: 0.005,
      regulation: 'up',
    },
    {
      key: '2',
      gene: 'TP53',
      logFC: -1.8,
      pValue: 0.002,
      adjPValue: 0.008,
      regulation: 'down',
    },
    {
      key: '3',
      gene: 'EGFR',
      logFC: 3.2,
      pValue: 0.0001,
      adjPValue: 0.001,
      regulation: 'up',
    },
    {
      key: '4',
      gene: 'MYC',
      logFC: 1.9,
      pValue: 0.003,
      adjPValue: 0.01,
      regulation: 'up',
    },
    {
      key: '5',
      gene: 'PTEN',
      logFC: -2.1,
      pValue: 0.0015,
      adjPValue: 0.007,
      regulation: 'down',
    },
  ];

  const columns = [
    {
      title: '基因名称',
      dataIndex: 'gene',
      key: 'gene',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Log2 Fold Change',
      dataIndex: 'logFC',
      key: 'logFC',
      render: (value) => (
        <span style={{ color: value > 0 ? '#cf1322' : '#3f8600' }}>
          {value > 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'P-Value',
      dataIndex: 'pValue',
      key: 'pValue',
      render: (value) => value.toExponential(2),
    },
    {
      title: 'Adj P-Value',
      dataIndex: 'adjPValue',
      key: 'adjPValue',
      render: (value) => value.toExponential(2),
    },
    {
      title: '调控方向',
      dataIndex: 'regulation',
      key: 'regulation',
      render: (reg) => (
        <span style={{ color: reg === 'up' ? '#cf1322' : '#3f8600' }}>
          {reg === 'up' ? '上调' : '下调'}
          {reg === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </span>
      ),
    },
  ];

  const handleRunAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="上调基因"
              value={3}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="下调基因"
              value={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总基因数"
              value={5}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="显著性基因"
              value={5}
              valueStyle={{ color: '#722ed1' }}
              suffix="/ 5"
            />
          </Card>
        </Col>
      </Row>

      <Card title="分析工具" style={{ marginBottom: 24 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="差异表达分析" key="1">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ marginBottom: 8 }}>选择对照组：</div>
                  <Select defaultValue="control" style={{ width: '100%' }}>
                    <Option value="control">对照组</Option>
                    <Option value="treatment1">处理组1</Option>
                    <Option value="treatment2">处理组2</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 8 }}>选择实验组：</div>
                  <Select defaultValue="treatment1" style={{ width: '100%' }}>
                    <Option value="treatment1">处理组1</Option>
                    <Option value="treatment2">处理组2</Option>
                    <Option value="treatment3">处理组3</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <div style={{ marginBottom: 8 }}>显著性阈值：</div>
                  <Select defaultValue="0.05" style={{ width: '100%' }}>
                    <Option value="0.01">P &lt; 0.01</Option>
                    <Option value="0.05">P &lt; 0.05</Option>
                    <Option value="0.1">P &lt; 0.1</Option>
                  </Select>
                </Col>
              </Row>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={loading}
                onClick={handleRunAnalysis}
                size="large"
              >
                开始分析
              </Button>
            </Space>
          </TabPane>
          <TabPane tab="GO富集分析" key="2">
            <p>GO富集分析功能开发中...</p>
          </TabPane>
          <TabPane tab="KEGG通路分析" key="3">
            <p>KEGG通路分析功能开发中...</p>
          </TabPane>
          <TabPane tab="聚类分析" key="4">
            <p>聚类分析功能开发中...</p>
          </TabPane>
        </Tabs>
      </Card>

      <Card title="分析结果">
        <Table
          columns={columns}
          dataSource={differentialData}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default DataAnalysis;