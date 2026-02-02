import { useState } from 'react';
import { Layout, Menu, Button, Space, Badge, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  ProjectOutlined,
  CarryOutOutlined,
  FormOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置
  const menuItems = [
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: '分析平台',
    },
    {
      key: '/my-project',
      icon: <ProjectOutlined />,
      label: '我的项目',
      children: [
        {
          key: '/project-progress',
          label: '项目进度',
        },
        {
          key: '/project-results',
          label: '项目结果',
        },
        {
          key: '/project-relation',
          label: '项目关联',
        },
      ],
    },
    {
      key: '/tasks',
      icon: <CarryOutOutlined />,
      label: '我的任务',
    },
    {
      key: '/forms',
      icon: <FormOutlined />,
      label: '我的表单',
    },
    {
      key: '/raw-data',
      icon: <DatabaseOutlined />,
      label: '原始数据分析',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航栏 - 固定在最上方 */}
      <Header>
        {/* 左侧区域 - Logo 和折叠按钮，占比3 */}
        <div className="header-left-section">
          <img src="/Logo.png" alt="Omicsmart" style={{ height: '38px', marginRight: '16px' }} />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 48,
              height: 48,
              color: '#595959',
            }}
          />
        </div>

        {/* 中间区域 - 预留区域，占比12 */}
        <div className="header-center-section">
          {/* 这里可以放置其他内容 */}
        </div>

        {/* 右侧区域 - 账户信息，占比2 */}
        <div className="header-right-section">
          <span>用户名</span>
          <Avatar size="small" style={{ marginLeft: '8px', backgroundColor: '#87d068' }} icon={<span>U</span>} />
        </div>
      </Header>

      {/* 下方布局：左侧边栏 + 右侧内容区 */}
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 45px)',
            position: 'fixed',
            left: 0,
            top: 45,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['/my-project']}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
          <Content
            style={{
              padding: 24,
              background: '#fafafa',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;