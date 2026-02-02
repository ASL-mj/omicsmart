import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GSEAAnalysis = () => {
  return (
    <PageTemplate 
      title="GSEA分析" 
      description="在此页面可以查看基因集富集分析(GSEA)的结果。"
    >
      <div>
        <p>GSEA分析识别在差异表达谱中显著富集的基因集。</p>
        <p>该分析有助于理解生物学过程的整体变化趋势。</p>
      </div>
    </PageTemplate>
  );
};

export default GSEAAnalysis;