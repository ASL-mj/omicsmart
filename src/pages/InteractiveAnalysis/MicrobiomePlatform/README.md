# 微生物平台结果模块

## 目录结构

```
MicrobiomePlatform/
├── index.jsx                    # 平台入口，路由配置
├── layout/                      # 布局组件
│   ├── index.jsx               # 主布局（侧边栏+内容区）
│   └── index.module.css        # 布局样式
├── components/                  # 共享组件（待实现）
│   ├── PageTemplate/           # 页面模板
│   ├── ResultPageTemplate/     # 结果页模板
│   ├── TaskDrawer/             # 任务抽屉
│   └── D3Charts/               # 图表组件库
├── config/                      # 配置文件
│   └── navigation.js           # 导航配置
└── pages/                       # 功能页面（待实现）
    ├── TaskOverview/           # 任务总览
    ├── ReportNavigation/       # 报告导航
    ├── QCReport/               # 质控报告
    ├── GroupScheme/            # 分组方案
    ├── OTUFilter/              # OTU筛选
    ├── SpeciesComposition/     # 物种组成分析
    ├── IndicatorSpecies/       # 指示物种分析
    ├── AlphaDiversity/         # Alpha多样性分析
    ├── BetaDiversity/          # Beta多样性分析
    ├── FunctionalAnalysis/     # 功能分析
    ├── EnvironmentalFactors/   # 环境因子分析
    └── MicrobiomeQuery/        # 微生物特征查询
```

## 功能模块说明

### 1. 快速搜索导航
- 提供全局搜索功能
- 快速定位到各个分析模块

### 2. 报告导航
- 展示分析报告的整体结构
- 提供快速跳转功能

### 3. 质控报告
- 展示测序数据质量控制结果
- 包含质量评估指标和图表

### 4. 分组方案
- 样本分组管理
- 支持自定义分组方案

### 5. OTU筛选
- OTU（操作分类单元）筛选功能
- 支持多种筛选条件

### 6. 物种组成分析
- **物种丰度**: 展示各分类水平的物种丰度
- **物种热图**: 物种丰度热图可视化
- **物种分布**: 物种分布统计和可视化

### 7. 指示物种分析
- **LEfSe分析**: 线性判别分析效应量分析
- **随机森林**: 基于随机森林的特征物种识别

### 8. Alpha多样性分析
- **多样性指数**: Shannon、Simpson、Chao1等指数
- **稀释曲线**: 评估测序深度充分性
- **组间比较**: 不同分组间多样性比较

### 9. Beta多样性分析
- **PCA分析**: 主成分分析
- **PCoA分析**: 主坐标分析
- **NMDS分析**: 非度量多维尺度分析
- **ANOSIM分析**: 相似性分析

### 10. 功能分析
- **PICRUSt2**: 基于16S预测宏基因组功能
- **BugBase**: 微生物表型预测
- **FAPROTAX**: 功能注释

### 11. 环境因子分析
- **RDA分析**: 冗余分析
- **CCA分析**: 典范对应分析
- **相关性分析**: 环境因子与物种相关性

### 12. 微生物特征查询
- **物种查询**: 查询特定物种信息
- **样本/分组查询**: 查询样本或分组的微生物特征

## 导航配置

导航配置文件位于 `config/navigation.js`，采用树形结构：

```javascript
{
  key: 'module-key',           // 唯一标识
  label: '模块名称',            // 显示名称
  icon: IconComponent,         // 图标组件
  path: '/microbiome/path',    // 路由路径
  children: [...]              // 子菜单（可选）
}
```

## 路由结构

所有路由以 `/microbiome/` 为前缀：

- `/microbiome/quick-search` - 快速搜索
- `/microbiome/report-navigation` - 报告导航
- `/microbiome/qc-report` - 质控报告
- `/microbiome/group-scheme` - 分组方案
- `/microbiome/otu-filter` - OTU筛选
- `/microbiome/species-composition/*` - 物种组成分析
- `/microbiome/indicator-species/*` - 指示物种分析
- `/microbiome/alpha-diversity/*` - Alpha多样性
- `/microbiome/beta-diversity/*` - Beta多样性
- `/microbiome/functional-analysis/*` - 功能分析
- `/microbiome/environmental-factors/*` - 环境因子
- `/microbiome/microbiome-query/*` - 微生物特征查询

## 开发指南

### 添加新页面

1. 在 `pages/` 目录下创建对应的页面组件
2. 在 `config/navigation.js` 中添加导航配置
3. 在 `index.jsx` 中添加路由配置

### 页面组件模板

```jsx
import React from 'react';

const PageComponent = () => {
  return (
    <div>
      {/* 页面内容 */}
    </div>
  );
};

export default PageComponent;
```

### 使用布局组件

布局组件会自动处理：
- 侧边栏导航
- 顶部Tab导航（二级、三级）
- 搜索功能
- 响应式布局

## 技术栈

- React 18
- React Router v6
- Ant Design 5
- CSS Modules

## 参考文档

详细开发规范请参考：`docs/SingleCellPlatform_Development_Manual.md`

## 待实现功能

- [ ] 各页面组件的具体实现
- [ ] PageTemplate 页面模板组件
- [ ] ResultPageTemplate 结果页模板组件
- [ ] TaskDrawer 任务抽屉组件
- [ ] D3Charts 图表组件库
- [ ] API 接口对接
- [ ] 数据Mock
- [ ] 单元测试

## 更新日志

### v1.0.0 (2026-02-10)
- 初始化项目结构
- 完成导航配置
- 完成布局组件
- 完成路由配置
