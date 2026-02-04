import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const MyClassroom = () => {
  return (
    <PageTemplate 
      title="我的课堂" 
      description="在此页面可以访问专属的学习资源和课程。"
    >
      <div>
        <p>我的课堂提供了关于单细胞测序分析的专业学习资源。</p>
        <p>您可以观看教学视频、下载教程文档，参与在线讨论。</p>
      </div>
    </PageTemplate>
  );
};

export default MyClassroom;