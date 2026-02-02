import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const TFGeneStats = () => {
  return (
    <PageTemplate 
      title="TF-gene统计" 
      description="在此页面可以查看转录因子及其靶基因的统计信息。"
    >
      <div>
        <p>TF-gene统计分析展示了转录因子与其靶基因之间的调控关系。</p>
        <p>该分析有助于理解基因表达的转录调控网络。</p>
      </div>
    </PageTemplate>
  );
};

export default TFGeneStats;