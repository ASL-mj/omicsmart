import { Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// 单细胞转录组平台配置
export const singleCellPlatformConfig = {
  id: 1,
  title: '单细胞转录组平台',
  icon: '🔬',

  // 自定义渲染左侧Logo区域
  renderLogo: () => (
    <div className="logo-img">
      <div style={{ fontSize: '80px' }}>🔬</div>
    </div>
  ),

  // 自定义渲染介绍内容
  renderDescription: () => (
    <>
      <p>单细胞转录组（Single cell RNA-sequencing , scRNA-seq）测序针对样本中的单个细胞的mRNA进行高通量测序，从单个细胞层面获得的转录组信息有助于去除整体带来的平均化影响，深度挖掘细胞异质性。</p>
      <p>本分析平台基于scRNA-seq的数据进行在线分析，可以根据客户的需求获得定制化的结果，可以实现低质量细胞过滤、细胞亚群频率分析、细胞注释、marker基因表达分布、细胞亚群上调基因分析、PAGA拟时分析、monocle拟时分析等基础以及个性化的单细胞转录组相关分析内容。此外，omicsmart在线报告可以通过参数设定获得实时交互结果，对数据进行深入挖掘；也可以调整图形样式、配色获得定制化的图形绘制。</p>
      <p>适用领域：需要对数据进行深入挖掘和对图形可视化有较高要求但对生信分析不够了解的客户可以通过该平台轻松完成单细胞转录组的数据分析。</p>
    </>
  ),

  // 自定义按钮配置
  buttons: [
    {
      type: 'primary',
      text: '单细胞纯分析低至2700/样',
      icon: <RightOutlined />,
      className: 'btnSpan1'
    },
  ],

  // 自定义Tab配置
  tabs: [
    {
      key: 'platformFeatures',
      label: '平台特点',
      children: (
        <div className="tab-content">
          <div className="feature-section">
            <Title level={4} style={{ color: '#1890ff' }}>快速上手的操作方式</Title>
            <Paragraph>简单的操作，详细的说明，一切操作简单上手，完成个性化的数据分析。</Paragraph>
          </div>
          <div className="feature-section">
            <Title level={4} style={{ color: '#1890ff' }}>动态交互的数据探索</Title>
            <Paragraph>根据需求来求进行图形绘制，也可根据图形展示结果进行一次图形绘制；1SNE图、小提琴图和热图或三种的数据可视化方式，便于高效的数据挖掘。</Paragraph>
          </div>
          <div className="feature-section">
            <Title level={4} style={{ color: '#1890ff' }}>个性高效的图形美化</Title>
            <Paragraph>所有图形都可以在线编辑中进行重绘，字体类大小等均可，并且分名称调整，证明整个名称调整生成图一步到位，便于用图形探索数据结果生成期刊所需图形。</Paragraph>
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
          <Paragraph>
            <p>[1] Maaten L V D, Hinton G. Visualizing Data using t-SNE[J]. Journal of Machine Learning Research, 2008, 9(2605):2579-2605.</p>
            <p>[2] Zheng G X, Terry J M, Belgrader P, et al. Massively parallel digital transcriptional profiling of single cells[J]. Nature Communications, 2017, 8:14049.</p>
            <p>[3] Mcdavid A, Finak G, Chattopadyay P K, et al. Data exploration, quality control and testing in single-cell qPCR-based gene expression experiments[J]. Bioinformatics, 2013, 29(4):461-467.</p>
            <p>[4] Freytag S, Tian L, Lönnstedt I and et al. Comparison of clustering tools in R for medium-sized 10x Genomics single-cell RNA-sequencing data[J]. Version 2. F1000Res, 2018, 7:1297.</p>
          </Paragraph>
        </div>
      )
    },
    {
      key: 'operationCase',
      label: '操作案例',
      children: (
        <div className="tab-content">
          <Paragraph>操作案例相关内容...</Paragraph>
        </div>
      )
    }
  ]
};