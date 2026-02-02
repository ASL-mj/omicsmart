import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const CellAnnotationAnalysis = () => {
  return (
    <PageTemplate 
      title="细胞注释分析" 
      description="在此页面可以对识别出的细胞亚群进行功能注释。"
    >
      <div>
        <p>细胞注释分析利用已知的标记基因对细胞亚群进行功能注释。</p>
        <p>您可以参考公共数据库或文献，将亚群与特定的细胞类型进行匹配。</p>
      </div>
    </PageTemplate>
  );
};

export default CellAnnotationAnalysis;