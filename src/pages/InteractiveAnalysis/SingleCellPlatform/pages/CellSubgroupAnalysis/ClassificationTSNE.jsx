import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';


const ClassificationTSNE = () => {
  const handleInteractiveAnalysis = () => {
    console.log('开始交互分析');
  };

  const handleViewTaskStatus = () => {
    console.log('查看任务状态');
  };

  return (
    <PageTemplate 
      pageTitle="分类t-SNE图"
      onInteractiveAnalysis={handleInteractiveAnalysis}
      onViewTaskStatus={handleViewTaskStatus}
    >
      <div>
        <p>t-SNE图展示了单细胞数据在二维空间中的降维结果。</p>
        <p>您可以根据标记基因对细胞进行着色，观察细胞亚群的分布。</p>
      </div>
    </PageTemplate>
  );
};


export default ClassificationTSNE;