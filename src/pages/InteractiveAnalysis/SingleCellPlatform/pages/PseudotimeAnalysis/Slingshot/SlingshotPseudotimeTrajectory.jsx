import React from 'react';
import PageTemplate from '../../../components/PageTemplate.jsx';

const SlingshotPseudotimeTrajectory = () => {
  return (
    <PageTemplate 
      title="拟时间值轨迹图" 
      description="在此页面可以查看Slingshot计算的拟时间值在细胞轨迹上的分布。"
    >
      <div>
        <p>Slingshot拟时间值轨迹图展示了细胞沿着推断轨迹的时间进展。</p>
        <p>您可以观察细胞从初始状态到最终状态的变化过程。</p>
      </div>
    </PageTemplate>
  );
};

export default SlingshotPseudotimeTrajectory;