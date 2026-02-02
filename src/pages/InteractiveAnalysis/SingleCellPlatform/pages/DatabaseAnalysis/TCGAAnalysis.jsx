import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const TCGAAnalysis = () => {
  return (
    <PageTemplate 
      title="TCGA分析" 
      description="在此页面可以进行TCGA数据库的分析。"
    >
      <div>
        <p>TCGA分析整合了癌症基因组图谱的数据，用于比较和验证结果。</p>
        <p>该分析提供了癌症相关基因表达和突变的信息。</p>
      </div>
    </PageTemplate>
  );
};

export default TCGAAnalysis;