import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const SlingshotMapping = () => {
  return (
    <PageTemplate 
      title="拟时间映射图" 
      description="在此页面可以查看Slingshot算法生成的细胞状态映射图。"
    >
      <div>
        <p>Slingshot拟时间映射图展示了细胞在假时间维度上的分布。</p>
        <p>该图帮助理解细胞群体的动态变化和分化顺序。</p>
      </div>
    </PageTemplate>
  );
};

export default SlingshotMapping;