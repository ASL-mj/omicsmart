import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const GeneSetAssessment = () => {
  return (
    <PageTemplate 
      title="基因集评估" 
      description="在此页面可以对基因集进行综合评估。"
    >
      <div>
        <p>基因集评估分析对输入的基因集合进行质量控制和功能评估。</p>
        <p>该分析确保基因集在后续分析中的可靠性和有效性。</p>
      </div>
    </PageTemplate>
  );
};

export default GeneSetAssessment;