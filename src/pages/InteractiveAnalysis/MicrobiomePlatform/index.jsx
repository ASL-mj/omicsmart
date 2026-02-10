import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import PageTemplate from './components/PageTemplate';

// 导入页面组件
import QCReport from './pages/QCReport';
import GroupScheme from './pages/GroupScheme';
import GroupSchemeDetail from './pages/GroupScheme/GroupSchemeDetail';
import OTUFilter from './pages/OTUFilter';
import OTUFilterDetail from './pages/OTUFilter/OTUFilterDetail';
import OTUFilterForm from './pages/OTUFilter/OTUFilterForm';

// 页面组件占位符 - 待实现
const ReportNavigation = () => <div>报告导航</div>;

// 物种组成分析
const SpeciesComposition = () => (
  <PageTemplate pageTitle="物种组成分析">
    <div>物种组成分析内容</div>
  </PageTemplate>
);

// 指示物种分析
const IndicatorSpecies = () => (
  <PageTemplate pageTitle="指示物种分析">
    <div>指示物种分析内容</div>
  </PageTemplate>
);

// Alpha多样性分析
const AlphaDiversity = () => (
  <PageTemplate pageTitle="Alpha多样性分析">
    <div>Alpha多样性分析内容</div>
  </PageTemplate>
);

// Beta多样性分析
const BetaDiversity = () => (
  <PageTemplate pageTitle="Beta多样性分析">
    <div>Beta多样性分析内容</div>
  </PageTemplate>
);

// 功能分析
const PICRUSt2 = () => (
  <PageTemplate pageTitle="PICRUSt2功能预测">
    <div>PICRUSt2分析内容</div>
  </PageTemplate>
);

const BugBase = () => (
  <PageTemplate pageTitle="BugBase表型预测">
    <div>BugBase分析内容</div>
  </PageTemplate>
);

const FAPROTAX = () => (
  <PageTemplate pageTitle="FAPROTAX功能注释">
    <div>FAPROTAX分析内容</div>
  </PageTemplate>
);

// 环境因子分析
const EnvironmentalFactors = () => (
  <PageTemplate pageTitle="环境因子分析">
    <div>环境因子分析内容</div>
  </PageTemplate>
);

// 微生物特征查询
const SpeciesQuery = () => (
  <PageTemplate pageTitle="物种查询">
    <div>物种查询内容</div>
  </PageTemplate>
);

const SampleGroupQuery = () => (
  <PageTemplate pageTitle="样本/分组查询">
    <div>样本/分组查询内容</div>
  </PageTemplate>
);

/**
 * 微生物平台主入口
 */
const MicrobiomePlatform = () => {
  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        {/* 默认重定向到快速搜索 */}
        <Route index element={<Navigate to="report-navigation" replace />} />
        
        {/* 一级菜单 */}
        <Route path="report-navigation" element={<ReportNavigation />} />
        <Route path="qc-report" element={<QCReport />} />
        <Route path="group-scheme" element={<GroupScheme />} />
        <Route path="group-scheme/detail" element={<GroupSchemeDetail />} />
        <Route path="otu-filter" element={<OTUFilter />} />
        <Route path="otu-filter/new" element={<OTUFilterForm />} />
        <Route path="otu-filter/detail" element={<OTUFilterDetail />} />
        
        {/* 物种组成分析 */}
        <Route path="species-composition" element={<SpeciesComposition />} />
        
        {/* 指示物种分析 */}
        <Route path="indicator-species" element={<IndicatorSpecies />} />
        
        {/* Alpha多样性分析 */}
        <Route path="alpha-diversity" element={<AlphaDiversity />} />
        
        {/* Beta多样性分析 */}
        <Route path="beta-diversity" element={<BetaDiversity />} />
        
        {/* 功能分析 */}
        <Route path="functional-analysis/picrust2" element={<PICRUSt2 />} />
        <Route path="functional-analysis/bugbase" element={<BugBase />} />
        <Route path="functional-analysis/faprotax" element={<FAPROTAX />} />
        
        {/* 环境因子分析 */}
        <Route path="environmental-factors" element={<EnvironmentalFactors />} />
        
        {/* 微生物特征查询 */}
        <Route path="microbiome-query/species" element={<SpeciesQuery />} />
        <Route path="microbiome-query/sample-group" element={<SampleGroupQuery />} />
      </Route>
    </Routes>
  );
};

export default MicrobiomePlatform;