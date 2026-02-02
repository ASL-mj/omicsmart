import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle2PseudotimeDEG = () => {
  return (
    <PageTemplate 
      title="拟时间轴差异基因" 
      description="在此页面可以查看沿拟时间轴表达变化的差异基因。"
    >
      <div>
        <p>Monocle2拟时间轴差异基因分析识别了随细胞发育进程表达变化的基因。</p>
        <p>您可以观察基因表达的动态变化模式，发现与分化过程相关的调控基因。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle2PseudotimeDEG;