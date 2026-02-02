import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const TargetGeneKEGGEnrichment = () => {
  return (
    <PageTemplate 
      title="目标基因KEGG富集" 
      description="在此页面可以查看目标基因的KEGG通路富集分析结果。"
    >
      <div>
        <p>目标基因KEGG富集分析展示了目标基因显著富集的信号通路。</p>
        <p>该分析揭示了目标基因参与的主要生物学通路。</p>
      </div>
    </PageTemplate>
  );
};

export default TargetGeneKEGGEnrichment;