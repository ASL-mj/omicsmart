import React from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';

const CustomColorScheme = () => {
  return (
    <PageTemplate 
      title="个性配色方案" 
      description="在此页面可以自定义分析图表的颜色方案。"
    >
      <div>
        <p>个性配色方案允许您自定义分析图表的颜色主题和配色方案。</p>
        <p>您可以选择预设的配色方案或创建自己的个性化配色。</p>
      </div>
    </PageTemplate>
  );
};

export default CustomColorScheme;