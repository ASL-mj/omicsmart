import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const PAGAScatter = () => {
  return (
    <PageTemplate 
      title="分化散点图" 
      description="在此页面可以查看使用PAGA算法分析的细胞分化过程散点图。"
    >
      <div>
        <p>PAGA分化散点图展示了细胞亚群之间的分化关系和连接强度。</p>
        <p>该图有助于识别潜在的分化路径和细胞状态转换。</p>
      </div>
    </PageTemplate>
  );
};

export default PAGAScatter;