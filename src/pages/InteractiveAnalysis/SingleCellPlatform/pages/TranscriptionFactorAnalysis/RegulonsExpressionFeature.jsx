import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const RegulonsExpressionFeature = () => {
  return (
    <PageTemplate 
      title="Regulons表达量特征" 
      description="在此页面可以查看转录因子调节网络的表达量特征。"
    >
      <div>
        <p>Regulons表达量特征分析展示了转录因子及其靶基因的表达模式。</p>
        <p>该分析有助于理解转录调控网络的表达协调性。</p>
      </div>
    </PageTemplate>
  );
};

export default RegulonsExpressionFeature;