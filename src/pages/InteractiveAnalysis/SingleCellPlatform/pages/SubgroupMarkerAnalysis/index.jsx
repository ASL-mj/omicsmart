import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const SubgroupMarkerAnalysis = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="亚群marker基因分析"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>在此页面可以识别和分析不同细胞亚群的标志基因。</p>
      </div>
    </PageTemplate>
  );
};

export default SubgroupMarkerAnalysis;