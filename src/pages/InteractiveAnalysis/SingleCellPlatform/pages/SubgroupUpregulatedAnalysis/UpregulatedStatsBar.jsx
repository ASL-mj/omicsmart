import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const UpregulatedStatsBar = () => {
  return (
    <PageTemplate 
      title="亚群上调统计柱状图" 
      description="在此页面可以查看亚群中上调基因的统计信息柱状图。"
    >
      <div>
        <p>上调基因统计柱状图展示了各细胞亚群中上调基因的数量和分布。</p>
        <p>您可以比较不同亚群之间的上调基因数量，识别特征性表达模式。</p>
      </div>
    </PageTemplate>
  );
};

export default UpregulatedStatsBar;