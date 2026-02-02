import { useState, useMemo } from 'react';
import { Layout, Menu, Input, Tabs, Button } from 'antd';
import { SearchOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { 
  navigationConfig, 
  getFirstLevelNavigation, 
  searchNavigation 
} from '../config/navigation';
import styles from './index.module.css';

const { Header, Sider, Content } = Layout;

const SingleCellLayout = ({ children, currentPageKey, onPageChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 直接使用传入的currentPageKey，不需要内部state
  const selectedKey = currentPageKey || 'report-navigation';

  // 获取当前页面的完整路径和层级信息
  const currentNavInfo = useMemo(() => {
    // 递归查找当前页面的完整路径
    const findNavPath = (key, nodes = navigationConfig, path = []) => {
      for (const node of nodes) {
        const currentPath = [...path, node];
        if (node.key === key) {
          return currentPath;
        }
        if (node.children) {
          const found = findNavPath(key, node.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    const path = findNavPath(selectedKey) || [navigationConfig[0]];
    const firstLevel = path[0];
    const secondLevel = path[1];
    const thirdLevel = path[2];
    
    return {
      path,
      firstLevel,
      secondLevel,
      thirdLevel,
      level: path.length,
    };
  }, [selectedKey]);

  // 获取当前应该显示的导航Tab（始终显示二级导航）
  const subNavigation = useMemo(() => {
    const { firstLevel } = currentNavInfo;
    return firstLevel?.children || [];
  }, [currentNavInfo]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchKeyword.trim()) return null;
    return searchNavigation(searchKeyword);
  }, [searchKeyword]);

  // 构建侧边栏菜单项（一级导航或搜索结果）
  const sidebarMenuItems = useMemo(() => {
    if (searchResults) {
      // 搜索模式：显示多级导航
      const buildSearchMenu = (results) => {
        const menuMap = new Map();
        
        results.forEach(result => {
          const path = result.path;
          
          // 构建层级结构
          path.forEach((node, index) => {
            if (!menuMap.has(node.key)) {
              menuMap.set(node.key, {
                key: node.key,
                label: node.label,
                children: [],
                level: index,
              });
            }
            
            // 如果有父节点，建立父子关系
            if (index > 0) {
              const parent = path[index - 1];
              const parentItem = menuMap.get(parent.key);
              const currentItem = menuMap.get(node.key);
              
              if (parentItem && !parentItem.children.find(c => c.key === node.key)) {
                parentItem.children.push(currentItem);
              }
            }
          });
        });
        
        // 获取顶层节点
        const topLevelNodes = Array.from(menuMap.values()).filter(item => item.level === 0);
        
        // 递归转换为Ant Design Menu格式
        const convertToMenuItem = (item) => {
          const menuItem = {
            key: item.key,
            label: item.label,
          };
          
          if (item.children && item.children.length > 0) {
            menuItem.children = item.children.map(convertToMenuItem);
          }
          
          return menuItem;
        };
        
        return topLevelNodes.map(convertToMenuItem);
      };
      
      return buildSearchMenu(searchResults);
    } else {
      // 正常模式：只显示一级导航
      return getFirstLevelNavigation().map(item => ({
        key: item.key,
        label: item.label,
      }));
    }
  }, [searchResults]);

  // 处理菜单选择
  const handleMenuSelect = ({ key }) => {
    // 查找选中的导航项
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
    
    // 如果选中的是有子项的一级导航，跳转到第一个子项
    if (selectedItem?.children && selectedItem.children.length > 0) {
      const firstChild = selectedItem.children[0];
      if (onPageChange) {
        onPageChange(firstChild.key);
      }
    } else {
      // 否则直接跳转到选中的页面
      if (onPageChange) {
        onPageChange(key);
      }
    }
  };

  // 处理搜索
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 构建顶部Tab项（只包含二级导航）
  const topTabItems = useMemo(() => {
    if (!subNavigation || subNavigation.length === 0) return [];
    
    return subNavigation.map(item => ({
      key: item.key,
      label: item.label,
    }));
  }, [subNavigation]);

  // 获取当前选中的二级导航项（用于显示三级Tab）
  const currentSecondLevel = useMemo(() => {
    const { secondLevel } = currentNavInfo;
    return secondLevel;
  }, [currentNavInfo]);

  // 构建三级Tab项
  const thirdLevelTabItems = useMemo(() => {
    if (!currentSecondLevel?.children || currentSecondLevel.children.length === 0) {
      return [];
    }
    
    return currentSecondLevel.children.map(child => ({
      key: child.key,
      label: child.label,
    }));
  }, [currentSecondLevel]);

  // 处理顶部Tab切换
  const handleTabChange = (key) => {
    if (onPageChange) {
      onPageChange(key);
    }
  };

  return (
    <Layout className={styles.singleCellLayout}>
      {/* 顶部Header */}
      <Header className={styles.analysisHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logoSection}>
            <img src="/Logo.png" alt="Logo" className={styles.headerLogo} />
            <div className={styles.headerTitle}>
              <h1>Single Cell</h1>
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
              onChange={handleSearch}
              allowClear
            />
          </div>
          
          {/* 导航菜单 */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={sidebarMenuItems}
            onClick={handleMenuSelect}
            className={styles.sidebarMenu}
            defaultOpenKeys={searchResults ? sidebarMenuItems.map(item => item.key) : []}
          />
        </Sider>

        {/* 右侧主内容区 */}
        <Layout className={styles.mainContent}>
          <Content className={styles.contentWrapper}>
            {/* 顶部二级三级导航Tab */}
            {topTabItems.length > 0 && (
              <div className={styles.topNavigation}>
                {/* 二级Tab */}
                <Tabs
                  activeKey={currentSecondLevel?.key || selectedKey}
                  items={topTabItems}
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
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SingleCellLayout;
