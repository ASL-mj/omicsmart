import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const UpregulatedGeneDistribution = () => {
  return (
    <PageTemplate 
      title="亚群上调基因分布" 
      description="在此页面可以查看亚群中上调基因的分布情况。"
    >
      <div>
        <p>上调基因分布图展示了在不同细胞亚群中上调基因的空间分布。</p>
        <p>您可以分析基因表达模式与细胞亚群的关系，发现潜在的生物学功能。</p>
      </div>
    </PageTemplate>
  );
};

export default UpregulatedGeneDistribution;