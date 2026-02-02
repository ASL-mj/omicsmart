import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const SlingshotDimensionReduction = () => {
  return (
    <PageTemplate 
      title="Slingshot降维图" 
      description="在此页面可以查看使用Slingshot算法进行降维分析的结果。"
    >
      <div>
        <p>Slingshot降维图展示了细胞在主要变化轨迹上的分布。</p>
        <p>该算法专门用于识别和追踪细胞的连续分化轨迹。</p>
      </div>
    </PageTemplate>
  );
};

export default SlingshotDimensionReduction;