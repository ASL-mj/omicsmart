# 微生物平台模块结构总览

## 已完成的文件结构

```
MicrobiomePlatform/
├── index.jsx                           ✅ 平台入口，包含所有路由配置
├── README.md                           ✅ 项目说明文档
├── STRUCTURE.md                        ✅ 结构总览文档
│
├── layout/                             ✅ 布局组件
│   ├── index.jsx                       ✅ 主布局组件（侧边栏+内容区+导航）
│   └── index.module.css                ✅ 布局样式
│
├── config/                             ✅ 配置文件
│   └── navigation.js                   ✅ 完整的导航配置（12个主模块）
│
├── components/                         📁 共享组件目录（待实现）
│   ├── PageTemplate/                   📁 页面模板组件
│   ├── ResultPageTemplate/             📁 结果页模板组件
│   ├── TaskDrawer/                     📁 任务抽屉组件
│   └── D3Charts/                       📁 图表组件库
│
└── pages/                              📁 功能页面目录（待实现）
    ├── TaskOverview/                   📁 任务总览
    ├── ReportNavigation/               📁 报告导航
    ├── QCReport/                       📁 质控报告
    ├── GroupScheme/                    📁 分组方案
    ├── OTUFilter/                      📁 OTU筛选
    ├── SpeciesComposition/             📁 物种组成分析（3个子页面）
    ├── IndicatorSpecies/               📁 指示物种分析（2个子页面）
    ├── AlphaDiversity/                 📁 Alpha多样性分析（3个子页面）
    ├── BetaDiversity/                  📁 Beta多样性分析（4个子页面）
    ├── FunctionalAnalysis/             📁 功能分析（3个子页面）
    ├── EnvironmentalFactors/           📁 环境因子分析（3个子页面）
    └── MicrobiomeQuery/                📁 微生物特征查询（2个子页面）
```

## 导航层级结构

### 一级导航（12个模块）

1. **快速搜索导航** - 搜索功能
2. **报告导航** - 报告总览
3. **质控报告** - 质量控制
4. **分组方案** - 样本分组
5. **OTU筛选** - OTU过滤
6. **物种组成分析** ⬇️
7. **指示物种分析** ⬇️
8. **Alpha多样性分析** ⬇️
9. **Beta多样性分析** ⬇️
10. **功能分析** ⬇️
11. **环境因子分析** ⬇️
12. **微生物特征查询** ⬇️

### 二级/三级导航

#### 物种组成分析（3个子页面）
- 物种丰度
- 物种热图
- 物种分布

#### 指示物种分析（2个子页面）
- LEfSe分析
- 随机森林

#### Alpha多样性分析（3个子页面）
- 多样性指数
- 稀释曲线
- 组间比较

#### Beta多样性分析（4个子页面）
- PCA分析
- PCoA分析
- NMDS分析
- ANOSIM分析

#### 功能分析（3个子页面）
- PICRUSt2
- BugBase
- FAPROTAX

#### 环境因子分析（3个子页面）
- RDA分析
- CCA分析
- 相关性分析

#### 微生物特征查询（2个子页面）
- 物种查询
- 样本/分组查询

## 路由映射表

| 路由路径 | 页面名称 | 状态 |
|---------|---------|------|
| `/microbiome/quick-search` | 快速搜索导航 | 🔲 待实现 |
| `/microbiome/report-navigation` | 报告导航 | 🔲 待实现 |
| `/microbiome/qc-report` | 质控报告 | 🔲 待实现 |
| `/microbiome/group-scheme` | 分组方案 | 🔲 待实现 |
| `/microbiome/otu-filter` | OTU筛选 | 🔲 待实现 |
| `/microbiome/species-composition/abundance` | 物种丰度 | 🔲 待实现 |
| `/microbiome/species-composition/heatmap` | 物种热图 | 🔲 待实现 |
| `/microbiome/species-composition/distribution` | 物种分布 | 🔲 待实现 |
| `/microbiome/indicator-species/lefse` | LEfSe分析 | 🔲 待实现 |
| `/microbiome/indicator-species/random-forest` | 随机森林 | 🔲 待实现 |
| `/microbiome/alpha-diversity/index` | 多样性指数 | 🔲 待实现 |
| `/microbiome/alpha-diversity/rarefaction` | 稀释曲线 | 🔲 待实现 |
| `/microbiome/alpha-diversity/comparison` | 组间比较 | 🔲 待实现 |
| `/microbiome/beta-diversity/pca` | PCA分析 | 🔲 待实现 |
| `/microbiome/beta-diversity/pcoa` | PCoA分析 | 🔲 待实现 |
| `/microbiome/beta-diversity/nmds` | NMDS分析 | 🔲 待实现 |
| `/microbiome/beta-diversity/anosim` | ANOSIM分析 | 🔲 待实现 |
| `/microbiome/functional-analysis/picrust2` | PICRUSt2 | 🔲 待实现 |
| `/microbiome/functional-analysis/bugbase` | BugBase | 🔲 待实现 |
| `/microbiome/functional-analysis/faprotax` | FAPROTAX | 🔲 待实现 |
| `/microbiome/environmental-factors/rda` | RDA分析 | 🔲 待实现 |
| `/microbiome/environmental-factors/cca` | CCA分析 | 🔲 待实现 |
| `/microbiome/environmental-factors/correlation` | 相关性分析 | 🔲 待实现 |
| `/microbiome/microbiome-query/species` | 物种查询 | 🔲 待实现 |
| `/microbiome/microbiome-query/sample-group` | 样本/分组查询 | 🔲 待实现 |

**总计**: 26个路由页面

## 核心功能特性

### 布局系统
- ✅ 响应式侧边栏（可折叠）
- ✅ 三级导航系统（一级菜单 + 二级Tab + 三级Tab）
- ✅ 全局搜索功能
- ✅ 自动路由管理

### 导航配置
- ✅ 树形结构配置
- ✅ 图标支持
- ✅ 路径映射
- ✅ 子菜单支持

### 样式系统
- ✅ CSS Modules
- ✅ 统一主题色
- ✅ 响应式设计

## 技术实现

### 核心技术
- React 18 + Hooks
- React Router v6
- Ant Design 5
- CSS Modules

### 关键组件
1. **MicrobiomeLayout**: 主布局组件
   - 侧边栏导航
   - 顶部Header
   - 内容区域
   - Tab导航

2. **Navigation Config**: 导航配置
   - 12个主模块
   - 26个页面路由
   - 树形结构

3. **Router Config**: 路由配置
   - 所有页面路由映射
   - 默认重定向
   - 嵌套路由支持

## 下一步开发建议

### 优先级1：核心组件
1. 复用单细胞平台的 PageTemplate 组件
2. 复用单细胞平台的 D3Charts 图表库
3. 根据需要调整样式

### 优先级2：页面实现
按照使用频率依次实现：
1. 报告导航
2. 质控报告
3. 物种组成分析
4. Alpha/Beta多样性分析
5. 其他分析模块

### 优先级3：数据对接
1. 定义API接口
2. 创建Mock数据
3. 实现数据请求逻辑

## 参考资源

- 单细胞平台开发手册: `docs/SingleCellPlatform_Development_Manual.md`
- 单细胞平台源码: `src/pages/InteractiveAnalysis/SingleCellPlatform/`
- Ant Design文档: https://ant.design/
- React Router文档: https://reactrouter.com/

## 维护信息

- **创建日期**: 2026-02-10
- **当前版本**: v1.0.0
- **状态**: 基础架构完成，页面待实现