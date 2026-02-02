import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const RegulonsActivityFeature = () => {
  return (
    <PageTemplate 
      title="Regulons活性特征" 
      description="在此页面可以查看转录因子调节网络的活性特征。"
    >
      <div>
        <p>Regulons活性特征分析展示了不同转录因子调节网络的激活模式。</p>
        <p>该分析帮助识别在特定生物学条件下活跃的转录调控模块。</p>
      </div>
    </PageTemplate>
  );
};

export default RegulonsActivityFeature;