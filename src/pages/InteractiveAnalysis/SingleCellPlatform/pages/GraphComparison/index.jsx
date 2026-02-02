import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GraphComparison = () => {
  return (
    <PageTemplate 
      title="图形比较" 
      description="在此页面可以比较不同分析结果的图形。"
    >
      <div>
        <p>图形比较功能允许用户同时查看和对比多种分析结果的可视化图表。</p>
        <p>该功能帮助识别不同分析方法或参数设置下的结果差异。</p>
      </div>
    </PageTemplate>
  );
};

export default GraphComparison;