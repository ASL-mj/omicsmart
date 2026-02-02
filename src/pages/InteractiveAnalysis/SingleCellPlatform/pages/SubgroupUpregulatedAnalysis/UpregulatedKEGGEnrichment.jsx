import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const UpregulatedKEGGEnrichment = () => {
  return (
    <PageTemplate 
      title="上调差异基因KEGG富集" 
      description="在此页面可以查看上调基因的KEGG通路富集分析结果。"
    >
      <div>
        <p>KEGG通路富集分析展示了上调基因显著富集的信号通路和代谢途径。</p>
        <p>您可以识别在细胞亚群中活跃的关键生物学通路，揭示潜在调控机制。</p>
      </div>
    </PageTemplate>
  );
};

export default UpregulatedKEGGEnrichment;