import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const DEGStats = () => {
  return (
    <PageTemplate 
      title="差异基因统计" 
      description="在此页面可以查看组间差异表达基因的统计信息。"
    >
      <div>
        <p>差异基因统计分析展示了不同组别间差异表达基因的数量和分布。</p>
        <p>该分析有助于识别在不同条件下显著变化的基因。</p>
      </div>
    </PageTemplate>
  );
};

export default DEGStats;