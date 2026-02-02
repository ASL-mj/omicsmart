import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const DEGDistribution = () => {
  return (
    <PageTemplate 
      title="差异基因分布" 
      description="在此页面可以查看差异表达基因在基因组上的分布情况。"
    >
      <div>
        <p>差异基因分布分析展示了差异基因在染色体或其他分类上的分布模式。</p>
        <p>该分析有助于识别基因组上具有功能相关性的区域。</p>
      </div>
    </PageTemplate>
  );
};

export default DEGDistribution;