import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const UpregulatedGOEnrichment = () => {
  return (
    <PageTemplate 
      title="上调差异基因GO富集" 
      description="在此页面可以查看上调基因的GO功能富集分析结果。"
    >
      <div>
        <p>GO富集分析展示了上调基因显著富集的生物过程、分子功能和细胞组分。</p>
        <p>您可以探索上调基因可能参与的生物学功能，理解其潜在机制。</p>
      </div>
    </PageTemplate>
  );
};

export default UpregulatedGOEnrichment;