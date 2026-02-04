import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const LigandReceptorPairAnalysis = () => {
  return (
    <PageTemplate 
      title="配受体对分析" 
      description="在此页面可以分析细胞间相互作用的配体-受体对。"
    >
      <div>
        <p>配受体对分析识别了在不同细胞类型间可能发生的信号传导事件。</p>
        <p>该分析有助于理解细胞间的通信机制和信号传递路径。</p>
      </div>
    </PageTemplate>
  );
};

export default LigandReceptorPairAnalysis;