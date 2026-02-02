import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GeneSetLigandReceptorInteraction = () => {
  return (
    <PageTemplate 
      title="基因集配受体对互作" 
      description="在此页面可以分析特定基因集内的配受体对互作。"
    >
      <div>
        <p>基因集配受体对互作分析聚焦于特定基因集合内的细胞通信事件。</p>
        <p>该分析揭示了功能相关基因在细胞间通信中的协同作用。</p>
      </div>
    </PageTemplate>
  );
};

export default GeneSetLigandReceptorInteraction;