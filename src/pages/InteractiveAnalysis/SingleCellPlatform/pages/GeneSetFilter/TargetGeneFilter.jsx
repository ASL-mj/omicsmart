import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const TargetGeneFilter = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="目标基因集筛选"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>在此页面可以对目标基因集进行筛选和分析。</p>
      </div>
    </PageTemplate>
  );
};

export default TargetGeneFilter;