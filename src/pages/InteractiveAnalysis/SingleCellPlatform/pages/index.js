// 导出所有页面组件
export { default as ReportNavigation } from './ReportNavigation';
export { default as GroupScheme } from './GroupScheme';
export { default as ProcessCellFilter } from './ProcessCellFilter';
export { default as TargetCellFilter } from './TargetCellFilter';

// 其他页面组件将在后续开发中添加
// 目前使用PageTemplate作为占位符
import PageTemplate from './PageTemplate';

// 基因集筛选
export const ClusterGeneFilter = () => <PageTemplate title="聚类基因集筛选" />;
export const TargetGeneFilter = () => <PageTemplate title="目标基因集筛选" />;

// 细胞质控总览
export const CellQCOverview = () => <PageTemplate title="细胞质控总览" />;

// 细胞亚群分类分析
export const CellFrequencyStats = () => <PageTemplate title="细胞频率统计" />;
export const ClassificationTSNE = () => <PageTemplate title="分类t-SNE图" />;
export const ClassificationUMAP = () => <PageTemplate title="分类UMAP图" />;
export const CellFrequencyDiff = () => <PageTemplate title="细胞频率差异" />;

// 亚群marker基因分析
export const SubgroupMarkerAnalysis = () => <PageTemplate title="亚群marker基因分析" />;

// 亚群上调基因分析
export const UpregulatedStatsBar = () => <PageTemplate title="亚群上调统计柱状图" />;
export const UpregulatedGeneDistribution = () => <PageTemplate title="亚群上调基因分布" />;
export const UpregulatedGOEnrichment = () => <PageTemplate title="上调差异基因GO富集" />;
export const UpregulatedKEGGEnrichment = () => <PageTemplate title="上调差异基因KEGG富集" />;

// 细胞注释分析
export const CellAnnotationAnalysis = () => <PageTemplate title="细胞注释分析" />;

// 拟时分析 - Monocle2
export const Monocle2Trajectory = () => <PageTemplate title="细胞轨迹图" />;
export const Monocle2PseudotimeDEG = () => <PageTemplate title="拟时间轴差异基因" />;
export const Monocle2StateDEG = () => <PageTemplate title="分化状态差异基因" />;
export const Monocle2FateDEG = () => <PageTemplate title="分化命运差异基因" />;
export const Monocle2Mapping = () => <PageTemplate title="Monocle2映射图" />;

// 拟时分析 - Monocle3
export const Monocle3DimensionReduction = () => <PageTemplate title="Monocle3降维图" />;
export const Monocle3PseudotimeTrajectory = () => <PageTemplate title="拟时间值轨迹图" />;
export const Monocle3Mapping = () => <PageTemplate title="Monocle3映射图" />;

// 拟时分析 - PAGA
export const PAGAScatter = () => <PageTemplate title="分化散点图" />;
export const PAGAGrid = () => <PageTemplate title="分化网格图" />;
export const PAGAFeatureVisualization = () => <PageTemplate title="特征基因可视化" />;
export const PAGAPseudotimeDEG = () => <PageTemplate title="拟时间轴差异基因" />;

// 拟时分析 - Slingshot
export const SlingshotDimensionReduction = () => <PageTemplate title="Slingshot降维图" />;
export const SlingshotPseudotimeTrajectory = () => <PageTemplate title="拟时间值轨迹图" />;
export const SlingshotMapping = () => <PageTemplate title="拟时间映射图" />;

// 拟时分析 - Cytotrace
export const CytotraceDifferentiationAssessment = () => <PageTemplate title="分化评估" />;
export const CytotraceDifferentiationMapping = () => <PageTemplate title="分化水平映射图" />;

// 细胞通讯分析
export const CellInteractionAnalysis = () => <PageTemplate title="细胞互作分析" />;
export const LigandReceptorPairAnalysis = () => <PageTemplate title="配受体对分析" />;
export const GeneSetCellPairInteraction = () => <PageTemplate title="基因集细胞对互作" />;
export const GeneSetLigandReceptorInteraction = () => <PageTemplate title="基因集配受体对互作" />;
export const CellPairLevelDiff = () => <PageTemplate title="细胞对水平差异" />;
export const LigandReceptorLevelDiff = () => <PageTemplate title="配受体对水平差异" />;
export const GeneSetLevelDiff = () => <PageTemplate title="基因集水平差异" />;

// 转录因子分析
export const TFGeneStats = () => <PageTemplate title="TF-gene统计" />;
export const RegulonsActivityDimensionReduction = () => <PageTemplate title="Regulons活性降维" />;
export const RegulonsActivityFeature = () => <PageTemplate title="Regulons活性特征" />;
export const RegulonsOpennessFeature = () => <PageTemplate title="Regulons开放性特征" />;
export const RegulonsExpressionFeature = () => <PageTemplate title="Regulons表达量特征" />;
export const TFGeneInteractionNetwork = () => <PageTemplate title="TF-gene互作网络" />;

// 组间差异分析
export const DEGStats = () => <PageTemplate title="差异基因统计" />;
export const DEGDistribution = () => <PageTemplate title="差异基因分布" />;
export const DEGGOEnrichment = () => <PageTemplate title="差异基因GO富集" />;
export const DEGKEGGEnrichment = () => <PageTemplate title="差异基因KEGG富集" />;
export const GSEAAnalysis = () => <PageTemplate title="GSEA分析" />;

// 基因集打分分析
export const GeneSetClassification = () => <PageTemplate title="基因集分类" />;
export const PositiveCellAnalysis = () => <PageTemplate title="阳性细胞分析" />;
export const GeneSetAssessment = () => <PageTemplate title="基因集评估" />;
export const GeneDistributionInSet = () => <PageTemplate title="基因集中基因分布" />;
export const GeneSetScoreDiff = () => <PageTemplate title="基因集评分差异" />;

// 目标基因分析
export const TargetGeneVenn = () => <PageTemplate title="目标基因韦恩图" />;
export const TargetGeneGOEnrichment = () => <PageTemplate title="目标基因GO富集" />;
export const TargetGeneKEGGEnrichment = () => <PageTemplate title="目标基因KEGG富集" />;

// 数据库分析
export const TCGAAnalysis = () => <PageTemplate title="TCGA分析" />;

// 基因查询
export const SubgroupTask = () => <PageTemplate title="亚群类任务" />;
export const GroupDiffTask = () => <PageTemplate title="组间差异任务" />;

// 其他
export const GraphComparison = () => <PageTemplate title="图形比较" />;
export const TaskOverview = () => <PageTemplate title="任务总览" />;
export const AnalysisReport = () => <PageTemplate title="分析报告" />;
export const CustomColorScheme = () => <PageTemplate title="个性配色方案" />;

// 专属Omicshare
export const MyClassroom = () => <PageTemplate title="我的课堂" />;
export const MyTools = () => <PageTemplate title="我的工具" />;
export const MyKnowledgeBase = () => <PageTemplate title="我的知识库" />;

// 建议与反馈
export const Feedback = () => <PageTemplate title="建议与反馈" />;