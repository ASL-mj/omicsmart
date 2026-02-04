import { useState, useEffect } from 'react';
import SingleCellLayout from './layout';
import * as Pages from './pages';

const SingleCellPlatform = () => {
  // 从URL hash中获取当前页面key
  const getPageKeyFromHash = () => {
    const hash = window.location.hash.slice(1); // 移除 # 号
    return hash || 'report-navigation';
  };

  const [currentPage, setCurrentPage] = useState(getPageKeyFromHash());

  // 监听hash变化
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageKeyFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 处理页面切换
  const handlePageChange = (pageKey) => {
    window.location.hash = `#${pageKey}`;
  };

  // 根据key获取对应的页面组件
  const getPageComponent = (key) => {
    const pageMap = {
      'report-navigation': Pages.ReportNavigation,
      'group-scheme': Pages.GroupScheme,
      'process-cell-filter': Pages.ProcessCellFilter,
      'target-cell-filter': Pages.TargetCellFilter,
      'cluster-gene-filter': Pages.ClusterGeneFilter,
      'target-gene-filter': Pages.TargetGeneFilter,
      'cell-qc-overview': Pages.CellQCOverview,
      'cell-frequency-stats': Pages.CellFrequencyStats,
      'classification-tsne': Pages.ClassificationTSNE,
      'classification-umap': Pages.ClassificationUMAP,
      'cell-frequency-diff': Pages.CellFrequencyDiff,
      'subgroup-marker-analysis': Pages.SubgroupMarkerAnalysis,
      'upregulated-stats-bar': Pages.UpregulatedStatsBar,
      'upregulated-gene-distribution': Pages.UpregulatedGeneDistribution,
      'upregulated-go-enrichment': Pages.UpregulatedGOEnrichment,
      'upregulated-kegg-enrichment': Pages.UpregulatedKEGGEnrichment,
      'cell-annotation-analysis': Pages.CellAnnotationAnalysis,
      'monocle2-trajectory': Pages.Monocle2Trajectory,
      'monocle2-pseudotime-deg': Pages.Monocle2PseudotimeDEG,
      'monocle2-state-deg': Pages.Monocle2StateDEG,
      'monocle2-fate-deg': Pages.Monocle2FateDEG,
      'monocle2-mapping': Pages.Monocle2Mapping,
      'monocle3-dimension-reduction': Pages.Monocle3DimensionReduction,
      'monocle3-pseudotime-trajectory': Pages.Monocle3PseudotimeTrajectory,
      'monocle3-mapping': Pages.Monocle3Mapping,
      'paga-scatter': Pages.PAGAScatter,
      'paga-network': Pages.PAGANetwork,
      'paga-feature-visualization': Pages.PAGAFeatureVisualization,
      'paga-pseudotime-deg': Pages.PAGAPseudotimeDEG,
      'slingshot-dimension-reduction': Pages.SlingshotDimensionReduction,
      'slingshot-pseudotime-trajectory': Pages.SlingshotPseudotimeTrajectory,
      'slingshot-mapping': Pages.SlingshotMapping,
      'cytotrace-differentiation-assessment': Pages.CytotraceDifferentiationAssessment,
      'cytotrace-differentiation-mapping': Pages.CytotraceLevelMapping,
      'cell-interaction-analysis': Pages.CellInteractionAnalysis,
      'ligand-receptor-pair-analysis': Pages.LigandReceptorPairAnalysis,
      'gene-set-cell-pair-interaction': Pages.GeneSetCellPairInteraction,
      'gene-set-ligand-receptor-interaction': Pages.GeneSetLigandReceptorInteraction,
      'cell-pair-level-diff': Pages.CellPairLevelDiff,
      'ligand-receptor-level-diff': Pages.LigandReceptorLevelDiff,
      'gene-set-level-diff': Pages.GeneSetLevelDiff,
      'tf-gene-stats': Pages.TFGeneStats,
      'regulons-activity-dimension-reduction': Pages.RegulonsActivityDimensionReduction,
      'regulons-activity-feature': Pages.RegulonsActivityFeature,
      'regulons-openness-feature': Pages.RegulonsOpennessFeature,
      'regulons-expression-feature': Pages.RegulonsExpressionFeature,
      'tf-gene-interaction-network': Pages.TFGeneInteractionNetwork,
      'deg-stats': Pages.DEGStats,
      'deg-distribution': Pages.DEGDistribution,
      'deg-go-enrichment': Pages.DEGGOEnrichment,
      'deg-kegg-enrichment': Pages.DEGKEGGEnrichment,
      'gsea-analysis': Pages.GSEAAnalysis,
      'gene-set-classification': Pages.GeneSetClassification,
      'positive-cell-analysis': Pages.PositiveCellAnalysis,
      'gene-set-assessment': Pages.GeneSetAssessment,
      'gene-distribution-in-set': Pages.GeneDistributionInSet,
      'gene-set-score-diff': Pages.GeneSetScoreDiff,
      'target-gene-venn': Pages.TargetGeneVenn,
      'target-gene-go-enrichment': Pages.TargetGeneGOEnrichment,
      'target-gene-kegg-enrichment': Pages.TargetGeneKEGGEnrichment,
      'tcga-analysis': Pages.TCGAAnalysis,
      'subgroup-task': Pages.SubgroupTask,
      'group-diff-task': Pages.GroupDiffTask,
      'graph-comparison': Pages.GraphComparison,
      'task-overview': Pages.TaskOverview,
      'analysis-report': Pages.AnalysisReport,
      'custom-color-scheme': Pages.CustomColorScheme,
      'my-classroom': Pages.MyClassroom,
      'my-tools': Pages.MyTools,
      'my-knowledge-base': Pages.MyKnowledgeBase,
      'feedback': Pages.Feedback,
    };

    const PageComponent = pageMap[key] || Pages.ReportNavigation;
    return <PageComponent />;
  };

  return (
    <SingleCellLayout 
      currentPageKey={currentPage}
      onPageChange={handlePageChange}
    >
      {getPageComponent(currentPage)}
    </SingleCellLayout>
  );
};

export default SingleCellPlatform;