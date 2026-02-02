import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle2Mapping = () => {
  return (
    <PageTemplate 
      title="Monocle2映射图" 
      description="在此页面可以查看Monocle2算法生成的细胞状态映射图。"
    >
      <div>
        <p>Monocle2映射图展示了细胞在低维空间中的分布和轨迹路径。</p>
        <p>您可以直观地观察细胞状态的连续变化，分析细胞群体的异质性。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle2Mapping;