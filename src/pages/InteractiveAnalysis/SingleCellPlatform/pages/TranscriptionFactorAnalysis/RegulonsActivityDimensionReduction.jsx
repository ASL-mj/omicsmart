import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const RegulonsActivityDimensionReduction = () => {
  return (
    <PageTemplate 
      title="Regulons活性降维" 
      description="在此页面可以查看转录因子调节网络在降维空间中的活性分布。"
    >
      <div>
        <p>Regulons活性降维分析展示了转录因子调节网络在低维空间中的活性模式。</p>
        <p>该分析有助于理解转录调控在细胞异质性中的作用。</p>
      </div>
    </PageTemplate>
  );
};

export default RegulonsActivityDimensionReduction;