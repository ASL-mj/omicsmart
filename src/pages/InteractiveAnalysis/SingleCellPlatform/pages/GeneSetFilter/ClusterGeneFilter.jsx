import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const ClusterGeneFilter = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="聚类基因集筛选"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>聚类基因集筛选功能帮助您识别在特定细胞聚类中显著表达的基因集合。</p>
        <p>您可以设置筛选参数，如最小表达基因数、平均表达量阈值等。</p>
      </div>
    </PageTemplate>
  );
};

export default ClusterGeneFilter;