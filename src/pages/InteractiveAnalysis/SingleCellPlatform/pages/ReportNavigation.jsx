import { Card, Row, Col, Typography, Space } from 'antd';
import { 
  FileTextOutlined, 
  FilterOutlined, 
  ExperimentOutlined,
  BarChartOutlined,
  NodeIndexOutlined,
  BranchesOutlined,
  ApiOutlined,
  FunctionOutlined,
  DiffOutlined,
  StarOutlined,
  AimOutlined,
  DatabaseOutlined,
  SearchOutlined,
  CompareOutlined,
  UnorderedListOutlined,
  FileSearchOutlined,
  BgColorsOutlined,
  CloudOutlined,
  MessageOutlined
} from '@ant-design/icons';
import styles from './ReportNavigation.module.css';

const { Title, Paragraph } = Typography;

const ReportNavigation = () => {
  const navigationSections = [
    {
      title: '基础配置',
      icon: <FileTextOutlined />,
      color: '#1890ff',
      items: [
        { name: '报告导航', key: 'report-navigation', icon: <FileTextOutlined /> },
        { name: '分组方案', key: 'group-scheme', icon: <FilterOutlined /> },
      ]
    },
    {
      title: '数据筛选',
      icon: <FilterOutlined />,
      color: '#52c41a',
      items: [
        { name: '细胞集筛选', key: 'cell-set-filter', icon: <FilterOutlined /> },
        { name: '基因集筛选', key: 'gene-set-filter', icon: <FilterOutlined /> },
      ]
    },
    {
      title: '质控与分类',
      icon: <ExperimentOutlined />,
      color: '#fa8c16',
      items: [
        { name: '细胞质控总览', key: 'cell-qc-overview', icon: <ExperimentOutlined /> },
        { name: '细胞亚群分类分析', key: 'cell-subgroup-analysis', icon: <BarChartOutlined /> },
        { name: '亚群marker基因分析', key: 'subgroup-marker-analysis', icon: <NodeIndexOutlined /> },
        { name: '亚群上调基因分析', key: 'subgroup-upregulated-analysis', icon: <BarChartOutlined /> },
        { name: '细胞注释分析', key: 'cell-annotation-analysis', icon: <FileTextOutlined /> },
      ]
    },
    {
      title: '拟时分析',
      icon: <BranchesOutlined />,
      color: '#722ed1',
      items: [
        { name: 'Monocle2', key: 'monocle2', icon: <BranchesOutlined /> },
        { name: 'Monocle3', key: 'monocle3', icon: <BranchesOutlined /> },
        { name: 'PAGA分析', key: 'paga-analysis', icon: <NodeIndexOutlined /> },
        { name: 'Slingshot', key: 'slingshot', icon: <BranchesOutlined /> },
        { name: 'Cytotrace', key: 'cytotrace', icon: <BranchesOutlined /> },
      ]
    },
    {
      title: '细胞通讯与转录因子',
      icon: <ApiOutlined />,
      color: '#eb2f96',
      items: [
        { name: '细胞通讯分析', key: 'cell-communication-analysis', icon: <ApiOutlined /> },
        { name: '转录因子分析', key: 'transcription-factor-analysis', icon: <FunctionOutlined /> },
      ]
    },
    {
      title: '差异与打分',
      icon: <DiffOutlined />,
      color: '#13c2c2',
      items: [
        { name: '组间差异分析', key: 'group-diff-analysis', icon: <DiffOutlined /> },
        { name: '基因集打分分析', key: 'gene-set-scoring-analysis', icon: <StarOutlined /> },
        { name: '目标基因分析', key: 'target-gene-analysis', icon: <AimOutlined /> },
      ]
    },
    {
      title: '数据库与查询',
      icon: <DatabaseOutlined />,
      color: '#faad14',
      items: [
        { name: '数据库分析', key: 'database-analysis', icon: <DatabaseOutlined /> },
        { name: '基因查询', key: 'gene-query', icon: <SearchOutlined /> },
      ]
    },
    {
      title: '工具与设置',
      icon: <UnorderedListOutlined />,
      color: '#2f54eb',
      items: [
        { name: '图形比较', key: 'graph-comparison', icon: <CompareOutlined /> },
        { name: '任务总览', key: 'task-overview', icon: <UnorderedListOutlined /> },
        { name: '分析报告', key: 'analysis-report', icon: <FileSearchOutlined /> },
        { name: '个性配色方案', key: 'custom-color-scheme', icon: <BgColorsOutlined /> },
        { name: '专属Omicshare', key: 'exclusive-omicshare', icon: <CloudOutlined /> },
        { name: '建议与反馈', key: 'feedback', icon: <MessageOutlined /> },
      ]
    },
  ];

  const handleNavigate = (key) => {
    window.location.hash = `#${key}`;
  };

  return (
    <div className={styles.reportNavigation}>
      <div className={styles.header}>
        <Title level={2}>单细胞分析报告导航</Title>
        <Paragraph>
          欢迎使用单细胞分析平台！本页面提供了所有分析模块的快速导航入口。
          点击下方卡片可快速跳转到对应的分析页面。
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {navigationSections.map((section, index) => (
          <Card
            key={index}
            title={
              <Space>
                <span style={{ color: section.color, fontSize: '20px' }}>
                  {section.icon}
                </span>
                <span>{section.title}</span>
              </Space>
            }
            className={styles.sectionCard}
          >
            <Row gutter={[16, 16]}>
              {section.items.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
                  <Card
                    hoverable
                    className={styles.navCard}
                    onClick={() => handleNavigate(item.key)}
                  >
                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                      <span style={{ fontSize: '32px', color: section.color }}>
                        {item.icon}
                      </span>
                      <span className={styles.navCardTitle}>{item.name}</span>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default ReportNavigation;