import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const TargetGeneGOEnrichment = () => {
  return (
    <PageTemplate 
      title="目标基因GO富集" 
      description="在此页面可以查看目标基因的GO功能富集分析结果。"
    >
      <div>
        <p>目标基因GO富集分析展示了目标基因显著富集的生物学功能。</p>
        <p>该分析有助于解释目标基因的生物学意义和功能特性。</p>
      </div>
    </PageTemplate>
  );
};

export default TargetGeneGOEnrichment;