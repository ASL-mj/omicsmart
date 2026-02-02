import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const PAGAGrid = () => {
  return (
    <PageTemplate 
      title="分化网格图" 
      description="在此页面可以查看PAGA算法生成的细胞分化网格图。"
    >
      <div>
        <p>PAGA分化网格图展示了细胞亚群之间的拓扑关系和分化方向。</p>
        <p>该图提供了细胞分化过程的简化但准确的表示。</p>
      </div>
    </PageTemplate>
  );
};

export default PAGAGrid;