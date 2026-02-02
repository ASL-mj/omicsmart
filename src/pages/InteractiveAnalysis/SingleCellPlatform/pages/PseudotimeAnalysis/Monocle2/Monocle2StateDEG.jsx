import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle2StateDEG = () => {
  return (
    <PageTemplate 
      title="分化状态差异基因" 
      description="在此页面可以查看不同分化状态下表达变化的基因。"
    >
      <div>
        <p>Monocle2分化状态差异基因分析比较了细胞在不同分化阶段的基因表达。</p>
        <p>您可以识别与特定分化状态相关的标志基因，揭示调控机制。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle2StateDEG;