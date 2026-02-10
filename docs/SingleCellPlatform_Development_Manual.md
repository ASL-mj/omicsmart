# 单细胞平台开发手册

## 目录
1. [整体架构设计](#整体架构设计)
2. [核心组件](#核心组件)
3. [页面模板](#页面模板)
4. [开发规范](#开发规范)
5. [可复用组件库](#可复用组件库)
6. [最佳实践](#最佳实践)

---

## 整体架构设计

### 1. 目录结构
```
src/pages/InteractiveAnalysis/SingleCellPlatform/
├── index.jsx                    # 平台入口
├── layout/                      # 布局组件
│   ├── index.jsx               # 主布局（侧边栏+内容区）
│   └── index.module.css
├── components/                  # 共享组件
│   ├── PageTemplate/           # 页面模板
│   ├── ResultPageTemplate/     # 结果页模板
│   ├── TaskDrawer/             # 任务抽屉
│   └── D3Charts/               # 图表组件库
├── config/                      # 配置文件
│   └── navigation.js           # 导航配置
└── pages/                       # 功能页面
    ├── TaskOverview/           # 任务总览
    ├── CellQCOverview/         # 细胞质控
    ├── CellSubgroupAnalysis/   # 细胞亚群分析
    └── ...
```

### 2. 核心设计理念

#### 2.1 三层架构
- **Layout层**: 统一的页面布局（侧边栏导航 + 内容区）
- **Template层**: 可复用的页面模板（PageTemplate, ResultPageTemplate）
- **Page层**: 具体的业务页面

#### 2.2 配置驱动
- 导航菜单通过配置文件 `navigation.js` 统一管理
- 支持多级菜单、图标、路由配置

#### 2.3 组件化
- 图表组件独立封装（D3Charts）
- 业务组件可复用（TaskDrawer, PageTemplate）

---

## 核心组件

### 1. Layout 布局组件

**功能**: 提供统一的页面布局框架

**特性**:
- 左侧可折叠导航栏
- 右侧内容区域
- 响应式设计
- 路由集成

**使用示例**:
```jsx
import Layout from './layout';

<Layout>
  {/* 页面内容 */}
</Layout>
```

### 2. PageTemplate 页面模板

**功能**: 标准页面容器，提供统一的页面头部和操作按钮

**Props**:
```typescript
interface PageTemplateProps {
  pageTitle: string;           // 页面标题
  showButtons?: boolean;       // 是否显示操作按钮
  onExport?: () => void;       // 导出回调
  onDownload?: () => void;     // 下载回调
  onCompare?: () => void;      // 对比回调
  children: ReactNode;         // 页面内容
}
```

**使用示例**:
```jsx
import PageTemplate from '../../components/PageTemplate';

<PageTemplate
  pageTitle="细胞质控总览"
  showButtons={true}
  onExport={handleExport}
  onDownload={handleDownload}
>
  {/* 页面内容 */}
</PageTemplate>
```

### 3. ResultPageTemplate 结果页模板

**功能**: 用于展示分析结果的专用模板

**特性**:
- 支持多Tab切换
- 集成图表展示
- 统一的结果页样式

### 4. TaskDrawer 任务抽屉

**功能**: 右侧滑出的任务详情面板

**特性**:
- 显示任务信息
- 快速操作入口
- 可自定义内容

### 5. D3Charts 图表组件库

**包含图表类型**:
- BarChart (柱状图)
- ScatterChart (散点图)
- HeatmapChart (热图)
- ViolinChart (小提琴图)
- BoxPlotChart (箱线图)
- NetworkChart (网络图)
- TrajectoryChart (轨迹图)
- CircosChart (环形图)
- 等...

**核心组件**:
- ChartContainer: 图表容器
- ChartAxis: 坐标轴
- ChartLegend: 图例
- ChartToolbar: 工具栏

---

## 页面模板

### 模板1: 标准分析结果页

```jsx
import React, { useState, useEffect } from 'react';
import { Tabs, Card, Spin } from 'antd';
import PageTemplate from '../../components/PageTemplate';
import { BarChart, ScatterChart } from '../../components/D3Charts';
import styles from './index.module.css';

const AnalysisResultPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取数据
      const response = await api.getData();
      setData(response);
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // 导出逻辑
  };

  const tabItems = [
    {
      key: 'overview',
      label: '总览',
      children: (
        <Card>
          <BarChart data={data?.overview} />
        </Card>
      ),
    },
    {
      key: 'detail',
      label: '详细分析',
      children: (
        <Card>
          <ScatterChart data={data?.detail} />
        </Card>
      ),
    },
  ];

  return (
    <PageTemplate
      pageTitle="分析结果"
      showButtons={true}
      onExport={handleExport}
    >
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
        />
      </Spin>
    </PageTemplate>
  );
};

export default AnalysisResultPage;
```

### 模板2: 表单配置页

```jsx
import React, { useState } from 'react';
import { Form, Input, Select, Button, Space, message } from 'antd';
import PageTemplate from '../../components/PageTemplate';
import styles from './index.module.css';

const { Option } = Select;

const ConfigurationPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.submitConfig(values);
      message.success('配置保存成功');
    } catch (error) {
      message.error('配置保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <PageTemplate pageTitle="参数配置" showButtons={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          label="分析类型"
          name="analysisType"
          rules={[{ required: true, message: '请选择分析类型' }]}
        >
          <Select placeholder="请选择">
            <Option value="type1">类型1</Option>
            <Option value="type2">类型2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="参数设置"
          name="parameters"
        >
          <Input placeholder="请输入参数" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </PageTemplate>
  );
};

export default ConfigurationPage;
```

### 模板3: 数据筛选页

```jsx
import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Space } from 'antd';
import PageTemplate from '../../components/PageTemplate';
import styles from './index.module.css';

const DataFilterPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">查看</Button>
          <Button type="link">编辑</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getFilteredData(filters);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate pageTitle="数据筛选" showButtons={false}>
      <div className={styles.filterSection}>
        <Space>
          <Input
            placeholder="搜索"
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
          <Select
            placeholder="选择类型"
            style={{ width: 200 }}
            onChange={(value) => setFilters({ ...filters, type: value })}
          >
            <Option value="all">全部</Option>
            <Option value="type1">类型1</Option>
          </Select>
          <Button type="primary" onClick={fetchData}>
            查询
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        className={styles.table}
      />
    </PageTemplate>
  );
};

export default DataFilterPage;
```

---

## 开发规范

### 1. 文件命名规范

- **组件文件**: PascalCase (如: `PageTemplate.jsx`)
- **样式文件**: 使用 CSS Modules (如: `index.module.css`)
- **工具文件**: camelCase (如: `api.js`)
- **配置文件**: camelCase (如: `navigation.js`)

### 2. 组件开发规范

#### 2.1 组件结构
```jsx
// 1. 导入依赖
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import styles from './index.module.css';

// 2. 类型定义（如使用TypeScript）
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. 组件定义
const Component = ({ title, onAction }: ComponentProps) => {
  // 4. 状态定义
  const [state, setState] = useState(null);

  // 5. 副作用
  useEffect(() => {
    // 初始化逻辑
  }, []);

  // 6. 事件处理
  const handleClick = () => {
    // 处理逻辑
  };

  // 7. 渲染
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

// 8. 导出
export default Component;
```

#### 2.2 样式规范
```css
/* 使用 CSS Modules */
.container {
  padding: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

/* 使用语义化的类名 */
.actionButton {
  margin-left: 8px;
}
```

### 3. 状态管理规范

- 局部状态使用 `useState`
- 复杂状态使用 `useReducer`
- 全局状态考虑使用 Context 或状态管理库

### 4. API 调用规范

```javascript
// utils/api.js
import request from './request';

export const api = {
  // 获取数据
  getData: (params) => request.get('/api/data', { params }),
  
  // 提交数据
  submitData: (data) => request.post('/api/submit', data),
  
  // 更新数据
  updateData: (id, data) => request.put(`/api/data/${id}`, data),
  
  // 删除数据
  deleteData: (id) => request.delete(`/api/data/${id}`),
};
```

### 5. 错误处理规范

```javascript
// 统一的错误处理
const handleError = (error, customMessage) => {
  console.error('Error:', error);
  message.error(customMessage || '操作失败，请稍后重试');
};

// 在组件中使用
try {
  await api.submitData(data);
  message.success('操作成功');
} catch (error) {
  handleError(error, '提交失败');
}
```

---

## 可复用组件库

### 1. 条件渲染表单项组件

**文件**: `src/components/ConditionalFormItem/index.jsx`

```jsx
import React from 'react';
import { Form, Checkbox, Row, Col, Space } from 'antd';

/**
 * 条件渲染表单项组件
 * 当checkbox选中时，展开显示额外的表单字段
 */
const ConditionalFormItem = ({
  name,
  label,
  checkboxProps = {},
  expandedContent,
  initialValue = false,
}) => {
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues[name] !== currentValues[name]
      }
    >
      {({ getFieldValue }) => {
        const isChecked = getFieldValue(name);
        return (
          <div>
            <Form.Item
              name={name}
              valuePropName="checked"
              initialValue={initialValue}
              noStyle
            >
              <Checkbox {...checkboxProps}>{label}</Checkbox>
            </Form.Item>
            {isChecked && expandedContent}
          </div>
        );
      }}
    </Form.Item>
  );
};

export default ConditionalFormItem;
```

**使用示例**:
```jsx
<ConditionalFormItem
  name="gseaChecked"
  label="GSEA分析"
  expandedContent={
    <div style={{ marginLeft: 24, marginTop: 12 }}>
      <Form.Item name="gseaDatabase" label="数据库">
        <Select>
          <Option value="go">GO</Option>
          <Option value="kegg">KEGG</Option>
        </Select>
      </Form.Item>
    </div>
  }
/>
```

### 2. 动态表单列表组件

**文件**: `src/components/DynamicFormList/index.jsx`

```jsx
import React from 'react';
import { Form, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

/**
 * 动态表单列表组件
 * 支持添加/删除表单项
 */
const DynamicFormList = ({
  name,
  label,
  renderItem,
  addButtonText = '添加',
  minItems = 1,
}) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {label && <div style={{ marginBottom: 8, fontWeight: 500 }}>{label}</div>}
          {fields.map((field, index) => (
            <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
              {renderItem(field, index)}
              {fields.length > minItems && (
                <MinusCircleOutlined
                  onClick={() => remove(field.name)}
                  style={{ color: '#ff4d4f' }}
                />
              )}
            </Space>
          ))}
          <Button
            type="dashed"
            onClick={() => add()}
            icon={<PlusOutlined />}
            style={{ width: '100%' }}
          >
            {addButtonText}
          </Button>
        </>
      )}
    </Form.List>
  );
};

export default DynamicFormList;
```

### 3. 数据加载容器组件

**文件**: `src/components/DataLoader/index.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Spin, Empty, Alert } from 'antd';

/**
 * 数据加载容器组件
 * 统一处理加载、错误、空数据状态
 */
const DataLoader = ({
  fetchData,
  dependencies = [],
  children,
  emptyText = '暂无数据',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, dependencies);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err.message || '数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="加载失败"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <Empty description={emptyText} style={{ margin: '50px 0' }} />;
  }

  return children(data, loadData);
};

export default DataLoader;
```

**使用示例**:
```jsx
<DataLoader
  fetchData={() => api.getData()}
  dependencies={[taskId]}
>
  {(data, reload) => (
    <div>
      <Button onClick={reload}>刷新</Button>
      <Table dataSource={data} />
    </div>
  )}
</DataLoader>
```

### 4. 图表容器组件

**文件**: `src/components/ChartWrapper/index.jsx`

```jsx
import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Space, Dropdown } from 'antd';
import { DownloadOutlined, FullscreenOutlined } from '@ant-design/icons';
import styles from './index.module.css';

/**
 * 图表容器组件
 * 提供统一的图表展示容器，包含下载、全屏等功能
 */
const ChartWrapper = ({
  title,
  children,
  onDownload,
  extra,
  loading = false,
}) => {
  const chartRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(chartRef.current);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const actions = (
    <Space>
      {onDownload && (
        <Button
          type="text"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
        >
          下载
        </Button>
      )}
      <Button
        type="text"
        icon={<FullscreenOutlined />}
        onClick={handleFullscreen}
      >
        全屏
      </Button>
      {extra}
    </Space>
  );

  return (
    <Card
      title={title}
      extra={actions}
      loading={loading}
      className={styles.chartCard}
    >
      <div ref={chartRef} className={styles.chartContainer}>
        {children}
      </div>
    </Card>
  );
};

export default ChartWrapper;
```

### 5. 筛选器组件

**文件**: `src/components/FilterPanel/index.jsx`

```jsx
import React from 'react';
import { Card, Form, Row, Col, Button, Space } from 'antd';
import styles from './index.module.css';

/**
 * 筛选器面板组件
 * 提供统一的筛选器布局
 */
const FilterPanel = ({
  filters,
  onFilter,
  onReset,
  collapsed = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onFilter(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <Card className={styles.filterPanel}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          {filters.map((filter, index) => (
            <Col span={filter.span || 6} key={index}>
              <Form.Item
                label={filter.label}
                name={filter.name}
                rules={filter.rules}
              >
                {filter.component}
              </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FilterPanel;
```

---

## 最佳实践

### 1. 性能优化

#### 1.1 使用 React.memo 避免不必要的重渲染
```jsx
const ChartComponent = React.memo(({ data }) => {
  return <div>{/* 图表渲染 */}</div>;
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.data === nextProps.data;
});
```

#### 1.2 使用 useMemo 缓存计算结果
```jsx
const processedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    calculated: expensiveCalculation(item)
  }));
}, [data]);
```

#### 1.3 使用 useCallback 缓存回调函数
```jsx
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependency]);
```

### 2. 代码组织

#### 2.1 自定义 Hooks
```jsx
// hooks/useTableData.js
import { useState, useEffect } from 'react';

export const useTableData = (fetchFn, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await fetchFn({ page, pageSize });
      setData(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    pagination,
    reload: fetchData,
  };
};
```

#### 2.2 常量管理
```javascript
// constants/index.js
export const ANALYSIS_TYPES = {
  QC: 'qc',
  CLUSTERING: 'clustering',
  DIFF: 'differential',
};

export const STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
};
```

### 3. 错误边界

```jsx
// components/ErrorBoundary/index.jsx
import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="页面出错了"
          subTitle="抱歉，页面遇到了一些问题"
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 4. 测试建议

#### 4.1 单元测试示例
```javascript
// __tests__/Component.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click event', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### 5. 文档注释

```jsx
/**
 * 分析结果展示组件
 * 
 * @component
 * @param {Object} props - 组件属性
 * @param {string} props.taskId - 任务ID
 * @param {Function} props.onExport - 导出回调函数
 * @param {boolean} [props.showToolbar=true] - 是否显示工具栏
 * 
 * @example
 * <AnalysisResult
 *   taskId="task-123"
 *   onExport={handleExport}
 *   showToolbar={true}
 * />
 */
const AnalysisResult = ({ taskId, onExport, showToolbar = true }) => {
  // 组件实现
};
```

---

## 快速开始指南

### 1. 创建新的分析模块

```bash
# 1. 创建目录结构
mkdir -p src/pages/InteractiveAnalysis/NewPlatform/{layout,components,config,pages}

# 2. 复制基础文件
cp -r src/pages/InteractiveAnalysis/SingleCellPlatform/layout/* \
      src/pages/InteractiveAnalysis/NewPlatform/layout/

cp -r src/pages/InteractiveAnalysis/SingleCellPlatform/components/PageTemplate \
      src/pages/InteractiveAnalysis/NewPlatform/components/
```

### 2. 配置导航

```javascript
// config/navigation.js
export const navigationConfig = [
  {
    key: 'overview',
    label: '总览',
    icon: 'DashboardOutlined',
    path: '/overview',
  },
  {
    key: 'analysis',
    label: '分析',
    icon: 'BarChartOutlined',
    children: [
      {
        key: 'analysis-1',
        label: '分析1',
        path: '/analysis/type1',
      },
    ],
  },
];
```

### 3. 创建页面

使用提供的页面模板快速创建新页面，根据需求选择合适的模板。

---

## 附录

### A. 常用工具函数

```javascript
// utils/helpers.js

// 格式化数字
export const formatNumber = (num, decimals = 2) => {
  return Number(num).toFixed(decimals);
};

// 下载文件
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// 防抖
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 节流
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
```

### B. 样式变量

```css
/* styles/variables.css */
:root {
  /* 颜色 */
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 字体 */
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  
  /* 圆角 */
  --border-radius-sm: 2px;
  --border-radius-base: 4px;
  --border-radius-lg: 8px;
}
```

### C. 参考资源

- [React 官方文档](https://react.dev/)
- [Ant Design 组件库](https://ant.design/)
- [D3.js 数据可视化](https://d3js.org/)
- [React Router 路由](https://reactrouter.com/)

---

## 更新日志

### v1.0.0 (2026-02-10)
- 初始版本发布
- 完成核心组件文档
- 提供页面模板
- 添加开发规范

---

**维护者**: 开发团队  
**最后更新**: 2026-02-10
