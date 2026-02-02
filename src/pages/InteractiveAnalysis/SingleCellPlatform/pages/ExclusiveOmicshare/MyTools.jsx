import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const MyTools = () => {
  return (
    <PageTemplate 
      title="我的工具" 
      description="在此页面可以访问专属的分析工具和实用程序。"
    >
      <div>
        <p>我的工具提供了额外的分析工具和实用程序，辅助您的研究工作。</p>
        <p>您可以使用这些专业工具进行更深入的数据挖掘和分析。</p>
      </div>
    </PageTemplate>
  );
};

export default MyTools;