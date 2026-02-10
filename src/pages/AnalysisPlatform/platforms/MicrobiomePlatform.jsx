import { Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// 单细胞转录组平台配置
export const MicrobiomePlatform = {
    id: 3,
    title: '微生物多样性平台【全新版本】',
    icon: '🦠',

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
            text: '16S/ITS测序低至64元/样',
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
                        <Title level={4} style={{ color: '#1890ff' }}>专业全面的分析内容</Title>
                        <Paragraph>提供涵盖α/β多样性、物种组成、指示物种、功能预测、环境因子分析在内的全套核心分析模块，可个性化调整样本分组和比较方案、选择不同的物种注释数据库、自定义OTU聚类和筛选参数，确保分析路径与科学问题精准匹配。</Paragraph>
                    </div>
                    <div className="feature-section">
                        <Title level={4} style={{ color: '#1890ff' }}>大样本机器学习分析方案</Title>
                        <Paragraph>针对大样本、多维度数据集，提供大样本分析方案以实现深度数据挖掘。集成多种机器学习算法（如支持向量机、随机森林、弹性网络等）以识别关键生物标志物或构建预测模型；提供菌群分型分析（如K-中心点、K-均值划分），助力揭示潜在的微生物群落结构，为发表高水平研究成果提供有力支持。</Paragraph>
                    </div>
                    <div className="feature-section">
                        <Title level={4} style={{ color: '#1890ff' }}>动态交互的数据挖掘</Title>
                        <Paragraph>图形和表格的交互式设计，既可以满足个性化选择数据进行绘图，也可以根据图形结果挑选数据进行后续分析；可进行样本/分组、比较组、物种分类水平、α/β多样性指数类型、差异分析统计检验方法等的自由切换，便于高效进行数据挖掘。</Paragraph>
                    </div>
                    <div className="feature-section">
                        <Title level={4} style={{ color: '#1890ff' }}>个性高效的图形美化</Title>
                        <Paragraph>提供堆叠图、热图、PCoA图、LEfSe图、Mantel网络图等30+交互式图表类型；支持“所见即所得”的图形元素编辑，可以直接在图中点击实现文本、图例、配色的自由调整，哪里要改点哪里；同时，提供预设的出版级图形模板，可一键应用生成高质量图形，缩短发文周期。</Paragraph>
                    </div>
                </div >
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
<p>[1] Chen S, Zhou Y, Chen Y, et al. fastp: an ultra-fast all-in-one FASTQ preprocessor[J]. bioRxiv, 2018: 274100.</p>
<p>[2] Magoč T, Salzberg S L. FLASH: fast length adjustment of short reads to improve genome assemblies. Bioinformatics 27.21 (2011): 2957-2963.</p>
<p>[3] Caporaso, J. Gregory, et al. QIIME allows analysis of high-throughput community sequencing data. Nature methods 7.5 (2010): 335-336.</p>
<p>[4] Bokulich, Nicholas A., et al. Quality-filtering vastly improves diversity estimates from Illumina amplicon sequencing. Nature methods 10.1 (2013): 57-59.</p>
<p>[5] Edgar, Robert C. UPARSE: highly accurate OTU sequences from microbial amplicon reads. Nature methods 10.10 (2013): 996-998.</p>
<p>[6] Wang, Qiong, et al. "Naive Bayesian classifier for rapid assignment of rRNA sequences into the new bacterial taxonomy." Applied and environmental microbiology 73.16 (2007): 5261-5267.</p>
<p>[7] Ondov, Brian D., Nicholas H. Bergman, and Adam M. Phillippy. Interactive metagenomic visualization in a Web browser. BMC bioinformatics 12.1 (2011): 385.</p>
<p>[8] Segata, Nicola, et al. “Metagenomic biomarker discovery and explanation.” Genome biology 12.6 (2011): 1.</p>
<p>[9] Aßhauer, Kathrin P., et al. "Tax4Fun: predicting functional profiles from metagenomic 16S rRNA data." Bioinformatics 31.17 (2015): 2882-2884.</p>
<p>[10] Langille, Morgan GI, et al. "Predictive functional profiling of microbial communities using 16S rRNA marker gene sequences." Nature biotechnology 31.9 (2013): 814-821.</p>
<p>[11] Nguyen, Nhu H., et al. "FUNGuild: an open annotation tool for parsing fungal community datasets by ecological guild." Fungal Ecology 20 (2016): 241-248.</p>
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