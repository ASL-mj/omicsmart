import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const RegulonsOpennessFeature = () => {
  return (
    <PageTemplate 
      title="Regulons开放性特征" 
      description="在此页面可以查看转录因子调节网络的染色质开放性特征。"
    >
      <div>
        <p>Regulons开放性特征分析展示了转录因子结合位点的染色质开放性情况。</p>
        <p>该分析揭示了表观遗传调控在转录因子功能中的作用。</p>
      </div>
    </PageTemplate>
  );
};

export default RegulonsOpennessFeature;