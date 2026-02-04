import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const DEGKEGGEnrichment = () => {
  return (
    <PageTemplate 
      title="差异基因KEGG富集" 
      description="在此页面可以查看差异表达基因的KEGG通路富集分析结果。"
    >
      <div>
        <p>差异基因KEGG富集分析展示了显著富集的信号通路和代谢途径。</p>
        <p>该分析有助于识别受影响的主要生物学通路。</p>
      </div>
    </PageTemplate>
  );
};

export default DEGKEGGEnrichment;