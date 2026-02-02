import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GeneSetCellPairInteraction = () => {
  return (
    <PageTemplate 
      title="基因集细胞对互作" 
      description="在此页面可以分析特定基因集在细胞对之间的互作情况。"
    >
      <div>
        <p>基因集细胞对互作分析专注于特定功能基因集的细胞间相互作用。</p>
        <p>该分析有助于理解特定生物学过程中的细胞间通信。</p>
      </div>
    </PageTemplate>
  );
};

export default GeneSetCellPairInteraction;