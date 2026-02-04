import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const LigandReceptorLevelDiff = () => {
  return (
    <PageTemplate 
      title="配受体对水平差异" 
      description="在此页面可以分析不同条件下配受体对互作的差异。"
    >
      <div>
        <p>配受体对水平差异分析比较了不同条件下配体-受体相互作用的变化。</p>
        <p>该分析识别了受处理影响的特定信号传导路径。</p>
      </div>
    </PageTemplate>
  );
};

export default LigandReceptorLevelDiff;