import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';


const CellFrequencyDiff = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="细胞频率差异"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>在此页面可以查看不同样本或分组间细胞频率的差异。</p>
      </div>
    </PageTemplate>
  );
};

export default CellFrequencyDiff;