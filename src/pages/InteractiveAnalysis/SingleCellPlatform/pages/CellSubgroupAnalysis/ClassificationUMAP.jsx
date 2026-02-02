import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';


const ClassificationUMAP = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="分类UMAP图"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>UMAP图展示了单细胞数据的降维和聚类结果。</p>
      </div>
    </PageTemplate>
  );
};

export default ClassificationUMAP;