import { useState, useMemo } from 'react';
import { Layout, Menu, Input, Tabs, Button } from 'antd';
import { SearchOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { navigationConfig } from '../config/navigation';
import styles from './index.module.css';

const { Header, Sider, Content } = Layout;

/**
 * 微生物平台布局组件
 */
const MicrobiomeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 从URL路径获取当前选中的菜单项
  const selectedKey = useMemo(() => {
    const currentPath = location.pathname;
    
    // 查找匹配的导航项
    const findKey = (items) => {
      for (const item of items) {
        if (item.path === currentPath) {
          return item.key;
        }
        if (item.children) {
          const found = findKey(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findKey(navigationConfig) || 'quick-search';
  }, [location.pathname]);

  // 获取当前页面的导航信息
  const currentNavInfo = useMemo(() => {
    const findNavPath = (key, nodes = navigationConfig, path = []) => {
      for (const node of nodes) {
        const currentPath = [...path, node];
        if (node.key === key) {
          return { path: currentPath, node };
        }
        if (node.children) {
          const found = findNavPath(key, node.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    const result = findNavPath(selectedKey);
    const path = result?.path || [navigationConfig[0]];
    
    return {
      path,
      node: result?.node,
      firstLevel: path[0],
      secondLevel: path[1],
      thirdLevel: path[2],
      level: path.length,
    };
  }, [selectedKey]);

  // 搜索功能
  const searchResults = useMemo(() => {
    if (!searchKeyword.trim()) return null;
    
    const results = [];
    const search = (items, path = []) => {
      items.forEach(item => {
        const currentPath = [...path, item];
        if (item.label.toLowerCase().includes(searchKeyword.toLowerCase())) {
          results.push({ ...item, path: currentPath });
        }
        if (item.children) {
          search(item.children, currentPath);
        }
      });
    };
    
    search(navigationConfig);
    return results.length > 0 ? results : null;
  }, [searchKeyword]);

  // 构建侧边栏菜单项
  const sidebarMenuItems = useMemo(() => {
    if (searchResults) {
      return searchResults.map(result => ({
        key: result.key,
        label: result.label,
      }));
    }
    
    return navigationConfig.map(item => ({
      key: item.key,
      label: item.label,
      icon: item.icon ? <item.icon /> : null,
    }));
  }, [searchResults]);

  // 获取二级导航
  const subNavigation = useMemo(() => {
    const { firstLevel } = currentNavInfo;
    return firstLevel?.children || [];
  }, [currentNavInfo]);

  // 构建二级Tab项
  const secondLevelTabItems = useMemo(() => {
    return subNavigation.map(item => ({
      key: item.key,
      label: item.label,
    }));
  }, [subNavigation]);

  // 获取三级导航
  const thirdLevelTabItems = useMemo(() => {
    const { secondLevel } = currentNavInfo;
    if (!secondLevel?.children) return [];
    
    return secondLevel.children.map(child => ({
      key: child.key,
      label: child.label,
    }));
  }, [currentNavInfo]);

  // 处理菜单选择
  const handleMenuSelect = ({ key }) => {
    const findNavItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) return item;
        if (item.children) {
          const found = findNavItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedItem = findNavItem(navigationConfig, key);
    
    if (!selectedItem) return;
    
    // 如果有子项，导航到第一个子项
    if (selectedItem.children && selectedItem.children.length > 0) {
      const firstChild = selectedItem.children[0];
      if (firstChild.path) {
        navigate(firstChild.path);
      }
    } else if (selectedItem.path) {
      // 如果没有子项，直接导航到该项
      navigate(selectedItem.path);
    }
  };

  // 处理Tab切换
  const handleTabChange = (key) => {
    const findNavItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) return item;
        if (item.children) {
          const found = findNavItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedItem = findNavItem(navigationConfig, key);
    
    if (selectedItem?.path) {
      navigate(selectedItem.path);
    } else if (selectedItem?.children && selectedItem.children.length > 0) {
      const firstChild = selectedItem.children[0];
      if (firstChild.path) {
        navigate(firstChild.path);
      }
    }
  };

  return (
    <Layout className={styles.microbiomeLayout}>
      {/* 顶部Header */}
      <Header className={styles.analysisHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logoSection}>
            <img src="/Logo.png" alt="Logo" className={styles.headerLogo} />
            <div className={styles.headerTitle}>
              <h1>Microbiome</h1>
              <h2>Online Report</h2>
            </div>
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.triggerBtn}
          />
        </div>

        <div className={styles.headerRight}>
          <Button type="primary" onClick={() => navigate('/')}>
            首页
          </Button>
        </div>
      </Header>

      <Layout>
        {/* 左侧侧边栏 */}
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          width={240}
          className={styles.sidebar}
        >
          {/* 搜索框 */}
          <div className={styles.searchBox}>
            <Input
              placeholder="快速搜索导航"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
            />
          </div>
          
          {/* 导航菜单 */}
          <div className={styles.menuContainer}>
            <Menu
              mode="inline"
              selectedKeys={[currentNavInfo.firstLevel?.key]}
              items={sidebarMenuItems}
              onClick={handleMenuSelect}
              className={styles.sidebarMenu}
            />
          </div>
        </Sider>

        {/* 右侧主内容区 */}
        <Layout className={styles.mainContent}>
          <Content className={styles.contentWrapper}>
            {/* 二级和三级导航Tab */}
            {secondLevelTabItems.length > 0 && (
              <div className={styles.topNavigation}>
                {/* 二级Tab */}
                <Tabs
                  activeKey={currentNavInfo.secondLevel?.key || selectedKey}
                  items={secondLevelTabItems}
                  onChange={handleTabChange}
                  className={styles.secondLevelTabs}
                />
                
                {/* 三级Tab */}
                {thirdLevelTabItems.length > 0 && (
                  <Tabs
                    activeKey={selectedKey}
                    items={thirdLevelTabItems}
                    onChange={handleTabChange}
                    className={styles.thirdLevelTabs}
                  />
                )}
              </div>
            )}
            
            {/* 页面内容 */}
            <div className={styles.pageContent}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MicrobiomeLayout;