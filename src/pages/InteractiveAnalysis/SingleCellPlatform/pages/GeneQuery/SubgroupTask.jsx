import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const SubgroupTask = () => {
  return (
    <PageTemplate 
      title="亚群类任务" 
      description="在此页面可以查询与细胞亚群相关的基因信息。"
    >
      <div>
        <p>亚群类任务允许用户查询特定细胞亚群中的基因表达模式。</p>
        <p>该功能帮助识别亚群特异性标记基因和功能特征。</p>
      </div>
    </PageTemplate>
  );
};

export default SubgroupTask;