import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const PAGAFeatureVisualization = () => {
  return (
    <PageTemplate 
      title="特征基因可视化" 
      description="在此页面可以查看特征基因在PAGA图上的表达模式。"
    >
      <div>
        <p>PAGA特征基因可视化展示了特定基因在分化轨迹上的表达分布。</p>
        <p>您可以观察基因表达如何随着细胞分化过程发生变化。</p>
      </div>
    </PageTemplate>
  );
};

export default PAGAFeatureVisualization;