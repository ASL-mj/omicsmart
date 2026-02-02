import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const TFGeneInteractionNetwork = () => {
  return (
    <PageTemplate 
      title="TF-gene互作网络" 
      description="在此页面可以查看转录因子与基因之间的调控网络。"
    >
      <div>
        <p>TF-gene互作网络展示了转录因子与其靶基因之间的调控关系。</p>
        <p>该网络图帮助理解基因表达调控的复杂性和层次结构。</p>
      </div>
    </PageTemplate>
  );
};

export default TFGeneInteractionNetwork;