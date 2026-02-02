import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GeneSetClassification = () => {
  return (
    <PageTemplate 
      title="基因集分类" 
      description="在此页面可以对基因集进行分类和评分。"
    >
      <div>
        <p>基因集分类分析对功能相关的基因集合进行分类和评估。</p>
        <p>该分析有助于识别与特定生物学状态相关的功能模块。</p>
      </div>
    </PageTemplate>
  );
};

export default GeneSetClassification;