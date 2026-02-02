import { useState } from 'react';
import { Layout, Menu, Card, Space } from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import DataVisualization from '../components/DataVisualization';
import DataAnalysis from '../components/DataAnalysis';
import FileManager from '../components/FileManager';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '1',
      icon: <DatabaseOutlined />,
      label: '数据管理',
    },
    {
      key: '2',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
    {
      key: '3',
      icon: <LineChartOutlined />,
      label: '数据可视化',
    },
    {
      key: '4',
      icon: <FileTextOutlined />,
      label: '分析报告',
    },
    {
      key: '5',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <FileManager />;
      case '2':
        return <DataAnalysis />;
      case '3':
        return <DataVisualization />;
      case '4':
        return (
          <Card title="分析报告" bordered={false}>
            <p>分析报告功能开发中...</p>
          </Card>
        );
      case '5':
        return (
          <Card title="系统设置" bordered={false}>
            <p>系统设置功能开发中...</p>
          </Card>
        );
      default:
        return <FileManager />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="dashboard-header">
        <div className="logo">
          <DatabaseOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
          <span>生物信息学分析平台</span>
        </div>
        <div className="header-right">
          <Space>
            <span>欢迎使用</span>
          </Space>
        </div>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={200}
          className="dashboard-sider"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            items={menuItems}
            onClick={({ key }) => setSelectedMenu(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content className="dashboard-content">
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;