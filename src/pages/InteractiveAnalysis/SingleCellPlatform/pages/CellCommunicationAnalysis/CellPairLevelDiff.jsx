import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const CellPairLevelDiff = () => {
  return (
    <PageTemplate 
      title="细胞对水平差异" 
      description="在此页面可以分析不同条件下细胞对互作的差异。"
    >
      <div>
        <p>细胞对水平差异分析比较了不同实验条件下细胞间互作的变化。</p>
        <p>该分析有助于识别受处理影响的特定细胞对互作关系。</p>
      </div>
    </PageTemplate>
  );
};

export default CellPairLevelDiff;