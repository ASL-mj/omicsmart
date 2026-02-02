import React from 'react';
import PageTemplate from '../../components/PageTemplate';


// 细胞质控总览
const CellQCOverview = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="细胞质控总览"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>细胞质控总览展示了原始数据的质控指标分布情况。</p>
        <p>包括基因数、UMI数、线粒体基因比例等关键指标的统计图表。</p>
      </div>
    </PageTemplate>
  );
};


export default CellQCOverview;