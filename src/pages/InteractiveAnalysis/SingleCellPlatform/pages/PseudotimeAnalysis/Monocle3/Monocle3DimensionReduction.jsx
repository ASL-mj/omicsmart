import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle3DimensionReduction = () => {
  return (
    <PageTemplate 
      title="Monocle3降维图" 
      description="在此页面可以查看使用Monocle3算法进行降维的结果。"
    >
      <div>
        <p>Monocle3降维图展示了单细胞数据在低维空间中的拓扑结构。</p>
        <p>该算法更好地保留了全局结构，有助于识别细胞状态的连续变化。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle3DimensionReduction;