import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const TargetGeneVenn = () => {
  return (
    <PageTemplate 
      title="目标基因韦恩图" 
      description="在此页面可以通过韦恩图分析目标基因的交集和并集。"
    >
      <div>
        <p>目标基因韦恩图展示了不同基因集合之间的重叠关系。</p>
        <p>该分析有助于识别共同的和特异性的目标基因。</p>
      </div>
    </PageTemplate>
  );
};

export default TargetGeneVenn;