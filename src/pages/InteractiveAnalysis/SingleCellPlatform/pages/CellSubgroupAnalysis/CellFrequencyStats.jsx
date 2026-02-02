import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';


// 细胞亚群分类分析
const CellFrequencyStats = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="细胞频率统计"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>在此页面可以查看不同细胞亚群的频率统计信息。</p>
      </div>
    </PageTemplate>
  );
};

export default CellFrequencyStats;