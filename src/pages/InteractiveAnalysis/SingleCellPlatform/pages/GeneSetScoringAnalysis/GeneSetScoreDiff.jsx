import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GeneSetScoreDiff = () => {
  return (
    <PageTemplate 
      title="基因集评分差异" 
      description="在此页面可以查看不同组间基因集评分的差异。"
    >
      <div>
        <p>基因集评分差异分析比较不同组别中基因集的活性评分。</p>
        <p>该分析识别在不同条件下显著变化的功能模块。</p>
      </div>
    </PageTemplate>
  );
};

export default GeneSetScoreDiff;