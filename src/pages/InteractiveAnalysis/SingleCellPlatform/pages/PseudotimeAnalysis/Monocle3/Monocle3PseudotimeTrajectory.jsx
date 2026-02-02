import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const Monocle3PseudotimeTrajectory = () => {
  return (
    <PageTemplate 
      title="拟时间值轨迹图" 
      description="在此页面可以查看Monocle3计算的拟时间值在细胞轨迹上的分布。"
    >
      <div>
        <p>Monocle3拟时间值轨迹图展示了细胞沿着发育轨迹的时间进展。</p>
        <p>您可以观察细胞从起始状态到终末状态的连续变化过程。</p>
      </div>
    </PageTemplate>
  );
};

export default Monocle3PseudotimeTrajectory;