import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const DEGGOEnrichment = () => {
  return (
    <PageTemplate 
      title="差异基因GO富集" 
      description="在此页面可以查看差异表达基因的GO功能富集分析结果。"
    >
      <div>
        <p>差异基因GO富集分析展示了显著富集的生物过程、分子功能和细胞组分。</p>
        <p>该分析有助于理解差异表达基因的生物学意义。</p>
      </div>
    </PageTemplate>
  );
};

export default DEGGOEnrichment;