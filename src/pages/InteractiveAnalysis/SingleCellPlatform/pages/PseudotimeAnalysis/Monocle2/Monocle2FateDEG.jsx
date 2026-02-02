import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle2FateDEG = () => {
  return (
    <PageTemplate 
      title="分化命运差异基因" 
      description="在此页面可以查看决定细胞分化命运的差异表达基因。"
    >
      <div>
        <p>Monocle2分化命运差异基因分析识别了决定细胞走向不同分化路径的基因。</p>
        <p>您可以研究在分化分支点处表达变化的基因，揭示细胞命运决定的分子机制。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle2FateDEG;