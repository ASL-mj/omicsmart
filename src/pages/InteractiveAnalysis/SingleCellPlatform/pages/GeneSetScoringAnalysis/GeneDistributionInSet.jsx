import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GeneDistributionInSet = () => {
  return (
    <PageTemplate 
      title="基因集中基因分布" 
      description="在此页面可以查看特定基因集内基因的分布和表达模式。"
    >
      <div>
        <p>基因集中基因分布分析展示了基因集内各个基因的表达特征。</p>
        <p>该分析有助于理解基因集内部的表达协调性和一致性。</p>
      </div>
    </PageTemplate>
  );
};

export default GeneDistributionInSet;