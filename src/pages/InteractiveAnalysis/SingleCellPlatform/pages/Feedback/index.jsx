import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const Feedback = () => {
  return (
    <PageTemplate 
      title="建议与反馈" 
      description="在此页面可以提交您的建议和反馈意见。"
    >
      <div>
        <p>建议与反馈页面为您提供了一个向我们团队提交建议和反馈的渠道。</p>
        <p>您可以报告遇到的问题，提出功能改进建议，或分享使用体验。</p>
      </div>
    </PageTemplate>
  );
};

export default Feedback;