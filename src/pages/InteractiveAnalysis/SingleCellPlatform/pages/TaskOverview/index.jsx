import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const TaskOverview = () => {
  return (
    <PageTemplate 
      title="任务总览" 
      description="在此页面可以查看所有分析任务的状态和进度。"
    >
      <div>
        <p>任务总览展示了所有运行中的和已完成的分析任务。</p>
        <p>您可以监控任务进度，重新运行失败的任务，或下载完成任务的结果。</p>
      </div>
    </PageTemplate>
  );
};

export default TaskOverview;