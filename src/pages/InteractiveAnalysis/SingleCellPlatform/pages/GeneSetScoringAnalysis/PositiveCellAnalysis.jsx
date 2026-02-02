import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const PositiveCellAnalysis = () => {
  return (
    <PageTemplate 
      title="阳性细胞分析" 
      description="在此页面可以分析高表达特定基因集的阳性细胞。"
    >
      <div>
        <p>阳性细胞分析识别高表达特定基因集合的细胞群体。</p>
        <p>该分析有助于理解基因集在细胞异质性中的表达模式。</p>
      </div>
    </PageTemplate>
  );
};

export default PositiveCellAnalysis;