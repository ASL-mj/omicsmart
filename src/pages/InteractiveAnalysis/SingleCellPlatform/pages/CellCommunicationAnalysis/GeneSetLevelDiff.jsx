import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const GeneSetLevelDiff = () => {
  return (
    <PageTemplate 
      title="基因集水平差异" 
      description="在此页面可以分析不同条件下基因集水平的互作差异。"
    >
      <div>
        <p>基因集水平差异分析比较了不同条件下功能相关基因集间的互作变化。</p>
        <p>该分析揭示了特定生物学通路在不同条件下的通信调节差异。</p>
      </div>
    </PageTemplate>
  );
};

export default GeneSetLevelDiff;