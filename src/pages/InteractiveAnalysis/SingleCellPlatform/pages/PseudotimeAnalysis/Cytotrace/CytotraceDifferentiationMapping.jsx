import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const CytotraceDifferentiationMapping = () => {
  return (
    <PageTemplate 
      title="分化水平映射图" 
      description="在此页面可以查看Cytotrace计算的细胞分化水平在降维空间中的分布。"
    >
      <div>
        <p>Cytotrace分化水平映射图展示了细胞分化状态在降维图上的空间分布。</p>
        <p>您可以观察分化程度不同的细胞在数据空间中的聚集情况。</p>
      </div>
    </PageTemplate>
  );
};

export default CytotraceDifferentiationMapping;