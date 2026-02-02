import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle2Trajectory = () => {
  return (
    <PageTemplate 
      title="细胞轨迹图" 
      description="在此页面可以查看使用Monocle2算法计算的细胞发育轨迹。"
    >
      <div>
        <p>Monocle2细胞轨迹图展示了细胞在发育或分化过程中的连续变化。</p>
        <p>您可以观察细胞沿着伪时间轴的状态转变，识别关键的分化节点。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle2Trajectory;