import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle3Mapping = () => {
  return (
    <PageTemplate 
      title="Monocle3映射图" 
      description="在此页面可以查看Monocle3算法生成的细胞状态映射图。"
    >
      <div>
        <p>Monocle3映射图展示了细胞在拟时间空间中的分布和轨迹结构。</p>
        <p>该方法能够更准确地重建复杂的细胞发育轨迹。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle3Mapping;