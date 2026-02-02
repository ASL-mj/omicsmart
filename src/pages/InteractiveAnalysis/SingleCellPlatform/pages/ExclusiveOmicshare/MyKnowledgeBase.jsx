import React from 'react';
import PageTemplate from '../../components/PageTemplate.jsx';

const MyKnowledgeBase = () => {
  return (
    <PageTemplate 
      title="我的知识库" 
      description="在此页面可以访问专业的知识库和FAQ。"
    >
      <div>
        <p>我的知识库包含了关于单细胞测序分析的专业知识和常见问题解答。</p>
        <p>您可以搜索相关主题，查找解决方案，或提交新的问题。</p>
      </div>
    </PageTemplate>
  );
};

export default MyKnowledgeBase;