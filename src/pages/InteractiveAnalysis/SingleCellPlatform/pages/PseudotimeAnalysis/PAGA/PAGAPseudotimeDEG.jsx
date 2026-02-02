import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const PAGAPseudotimeDEG = () => {
  return (
    <PageTemplate 
      title="拟时间轴差异基因" 
      description="在此页面可以查看PAGA分析中沿拟时间轴表达变化的基因。"
    >
      <div>
        <p>PAGA拟时间轴差异基因分析识别了在分化过程中表达变化的基因。</p>
        <p>这些基因可能在调控细胞分化和状态转换中起重要作用。</p>
      </div>
    </PageTemplate>
  );
};

export default PAGAPseudotimeDEG;