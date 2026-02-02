import { Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// 转录组平台配置
export const transcriptomePlatformConfig = {
  id: 2,
  title: '转录组平台',
  icon: '🧬',
  
  // 自定义渲染左侧Logo区域
  renderLogo: () => (
    <div className="logo-img">
      <div style={{ fontSize: '80px' }}>🧬</div>
    </div>
  ),
  
  // 自定义渲染介绍内容
  renderDescription: () => (
    <>
      转录组学（Transcriptomics）研究特定组织或细胞在特定状态下转录出来的全部RNA，包括mRNA和非编码RNA，全面反映基因表达水平和调控模式。本分析平台提供全面的转录组数据分析服务，涵盖从基础的序列比对、基因定量到高级的差异表达分析、功能富集分析、共表达网络构建等。平台支持多种转录组测序类型，包括mRNA-seq、lncRNA-seq、circRNA-seq等，可以根据客户需求提供定制化的分析方案和可视化报告。
    </>
  ),
  
  // 自定义按钮配置
  buttons: [
    {
      type: 'primary',
      text: '转录组纯分析低至1800/样',
      icon: <RightOutlined />,
      className: 'btnSpan1'
    }
    // 转录组没有"进入流程"按钮
  ],
  
  // 自定义Tab配置
  tabs: [
    {
      key: 'platformFeatures',
      label: '平台特点',
      children: (
        <div className="tab-content">
          <div className="feature-section">
            <Title level={4} style={{ color: '#1890ff' }}>高效便捷的分析流程</Title>
            <Paragraph>自动化的分析流程，标准化的分析方案，快速获得高质量的分析结果。</Paragraph>
          </div>
          <div className="feature-section">
            <Title level={4} style={{ color: '#1890ff' }}>全面的功能注释</Title>
            <Paragraph>整合多个主流数据库，包括GO、KEGG、Reactome等，提供全面的功能注释和通路分析。</Paragraph>
          </div>
          <div className="feature-section">
            <Title level={4} style={{ color: '#1890ff' }}>灵活的可视化方案</Title>
            <Paragraph>提供多种可视化图表类型，支持参数调整和样式定制，满足不同的展示需求。</Paragraph>
          </div>
        </div>
      )
    },
    {
      key: 'technicalParameters',
      label: '技术参数',
      children: (
        <div className="tab-content">
          <Paragraph>技术参数相关内容...</Paragraph>
        </div>
      )
    },
    {
      key: 'resultDisplay',
      label: '结果展示',
      children: (
        <div className="tab-content">
          <Paragraph>结果展示相关内容...</Paragraph>
        </div>
      )
    },
    {
      key: 'references',
      label: '参考文献',
      children: (
        <div className="tab-content">
          <Paragraph>参考文献相关内容...</Paragraph>
        </div>
      )
    }
    // 转录组没有"操作案例"Tab
  ]
};