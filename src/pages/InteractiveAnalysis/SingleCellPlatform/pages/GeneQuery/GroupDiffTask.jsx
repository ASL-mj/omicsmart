import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const GroupDiffTask = () => {
  return (
    <PageTemplate 
      title="组间差异任务" 
      description="在此页面可以查询组间差异分析相关的基因信息。"
    >
      <div>
        <p>组间差异任务允许用户查询参与组间差异分析的基因信息。</p>
        <p>该功能提供差异基因的详细注释和功能信息。</p>
      </div>
    </PageTemplate>
  );
};

export default GroupDiffTask;