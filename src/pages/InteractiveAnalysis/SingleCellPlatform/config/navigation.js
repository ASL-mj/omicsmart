// 导航配置
export const navigationConfig = [
  {
    key: 'report-navigation',
    label: '报告导航',
    path: '/report-navigation',
  },
  {
    key: 'group-scheme',
    label: '分组方案',
    path: '/group-scheme',
  },
  {
    key: 'cell-set-filter',
    label: '细胞集筛选',
    path: '/cell-set-filter',
    children: [
      {
        key: 'process-cell-filter',
        label: '流程细胞集筛选',
        path: '/cell-set-filter/process',
      },
      {
        key: 'target-cell-filter',
        label: '目标细胞集筛选',
        path: '/cell-set-filter/target',
      },
    ],
  },
  {
    key: 'gene-set-filter',
    label: '基因集筛选',
    path: '/gene-set-filter',
    children: [
      {
        key: 'cluster-gene-filter',
        label: '聚类基因集筛选',
        path: '/gene-set-filter/cluster',
      },
      {
        key: 'target-gene-filter',
        label: '目标基因集筛选',
        path: '/gene-set-filter/target',
      },
    ],
  },
  {
    key: 'cell-qc-overview',
    label: '细胞质控总览',
    path: '/cell-qc-overview',
  },
  {
    key: 'cell-subgroup-analysis',
    label: '细胞亚群分类分析',
    path: '/cell-subgroup-analysis',
    children: [
      {
        key: 'cell-frequency-stats',
        label: '细胞频率统计',
        path: '/cell-subgroup-analysis/frequency-stats',
      },
      {
        key: 'classification-tsne',
        label: '分类t-SNE图',
        path: '/cell-subgroup-analysis/tsne',
      },
      {
        key: 'classification-umap',
        label: '分类UMAP图',
        path: '/cell-subgroup-analysis/umap',
      },
      {
        key: 'cell-frequency-diff',
        label: '细胞频率差异',
        path: '/cell-subgroup-analysis/frequency-diff',
      },
    ],
  },
  {
    key: 'subgroup-marker-analysis',
    label: '亚群marker基因分析',
    path: '/subgroup-marker-analysis',
  },
  {
    key: 'subgroup-upregulated-analysis',
    label: '亚群上调基因分析',
    path: '/subgroup-upregulated-analysis',
    children: [
      {
        key: 'upregulated-stats-bar',
        label: '亚群上调统计柱状图',
        path: '/subgroup-upregulated-analysis/stats-bar',
      },
      {
        key: 'upregulated-gene-distribution',
        label: '亚群上调基因分布',
        path: '/subgroup-upregulated-analysis/gene-distribution',
      },
      {
        key: 'upregulated-go-enrichment',
        label: '上调差异基因GO富集',
        path: '/subgroup-upregulated-analysis/go-enrichment',
      },
      {
        key: 'upregulated-kegg-enrichment',
        label: '上调差异基因KEGG富集',
        path: '/subgroup-upregulated-analysis/kegg-enrichment',
      },
    ],
  },
  {
    key: 'cell-annotation-analysis',
    label: '细胞注释分析',
    path: '/cell-annotation-analysis',
  },
  {
    key: 'pseudotime-analysis',
    label: '拟时分析',
    path: '/pseudotime-analysis',
    children: [
      {
        key: 'monocle2',
        label: 'Monocle2',
        path: '/pseudotime-analysis/monocle2',
        children: [
          {
            key: 'monocle2-trajectory',
            label: '细胞轨迹图',
            path: '/pseudotime-analysis/monocle2/trajectory',
          },
          {
            key: 'monocle2-pseudotime-deg',
            label: '拟时间轴差异基因',
            path: '/pseudotime-analysis/monocle2/pseudotime-deg',
          },
          {
            key: 'monocle2-state-deg',
            label: '分化状态差异基因',
            path: '/pseudotime-analysis/monocle2/state-deg',
          },
          {
            key: 'monocle2-fate-deg',
            label: '分化命运差异基因',
            path: '/pseudotime-analysis/monocle2/fate-deg',
          },
          {
            key: 'monocle2-mapping',
            label: 'Monocle2映射图',
            path: '/pseudotime-analysis/monocle2/mapping',
          },
        ],
      },
      {
        key: 'monocle3',
        label: 'Monocle3',
        path: '/pseudotime-analysis/monocle3',
        children: [
          {
            key: 'monocle3-dimension-reduction',
            label: 'Monocle3降维图',
            path: '/pseudotime-analysis/monocle3/dimension-reduction',
          },
          {
            key: 'monocle3-pseudotime-trajectory',
            label: '拟时间值轨迹图',
            path: '/pseudotime-analysis/monocle3/pseudotime-trajectory',
          },
          {
            key: 'monocle3-mapping',
            label: 'Monocle3映射图',
            path: '/pseudotime-analysis/monocle3/mapping',
          },
        ],
      },
      {
        key: 'paga-analysis',
        label: 'PAGA分析',
        path: '/pseudotime-analysis/paga',
        children: [
          {
            key: 'paga-scatter',
            label: '分化散点图',
            path: '/pseudotime-analysis/paga/scatter',
          },
          {
            key: 'paga-grid',
            label: '分化网格图',
            path: '/pseudotime-analysis/paga/grid',
          },
          {
            key: 'paga-feature-visualization',
            label: '特征基因可视化',
            path: '/pseudotime-analysis/paga/feature-visualization',
          },
          {
            key: 'paga-pseudotime-deg',
            label: '拟时间轴差异基因',
            path: '/pseudotime-analysis/paga/pseudotime-deg',
          },
        ],
      },
      {
        key: 'slingshot',
        label: 'Slingshot',
        path: '/pseudotime-analysis/slingshot',
        children: [
          {
            key: 'slingshot-dimension-reduction',
            label: 'Slingshot降维图',
            path: '/pseudotime-analysis/slingshot/dimension-reduction',
          },
          {
            key: 'slingshot-pseudotime-trajectory',
            label: '拟时间值轨迹图',
            path: '/pseudotime-analysis/slingshot/pseudotime-trajectory',
          },
          {
            key: 'slingshot-mapping',
            label: '拟时间映射图',
            path: '/pseudotime-analysis/slingshot/mapping',
          },
        ],
      },
      {
        key: 'cytotrace',
        label: 'Cytotrace',
        path: '/pseudotime-analysis/cytotrace',
        children: [
          {
            key: 'cytotrace-differentiation-assessment',
            label: '分化评估',
            path: '/pseudotime-analysis/cytotrace/differentiation-assessment',
          },
          {
            key: 'cytotrace-differentiation-mapping',
            label: '分化水平映射图',
            path: '/pseudotime-analysis/cytotrace/differentiation-mapping',
          },
        ],
      },
    ],
  },
  {
    key: 'cell-communication-analysis',
    label: '细胞通讯分析',
    path: '/cell-communication-analysis',
    children: [
      {
        key: 'cell-interaction-analysis',
        label: '细胞互作分析',
        path: '/cell-communication-analysis/cell-interaction',
      },
      {
        key: 'ligand-receptor-pair-analysis',
        label: '配受体对分析',
        path: '/cell-communication-analysis/ligand-receptor-pair',
      },
      {
        key: 'gene-set-interaction',
        label: '基因集水平互作',
        path: '/cell-communication-analysis/gene-set-interaction',
        children: [
          {
            key: 'gene-set-cell-pair-interaction',
            label: '基因集细胞对互作',
            path: '/cell-communication-analysis/gene-set-interaction/cell-pair',
          },
          {
            key: 'gene-set-ligand-receptor-interaction',
            label: '基因集配受体对互作',
            path: '/cell-communication-analysis/gene-set-interaction/ligand-receptor',
          },
        ],
      },
      {
        key: 'group-diff-comparison',
        label: '组间差异比较',
        path: '/cell-communication-analysis/group-diff-comparison',
        children: [
          {
            key: 'cell-pair-level-diff',
            label: '细胞对水平差异',
            path: '/cell-communication-analysis/group-diff-comparison/cell-pair',
          },
          {
            key: 'ligand-receptor-level-diff',
            label: '配受体对水平差异',
            path: '/cell-communication-analysis/group-diff-comparison/ligand-receptor',
          },
          {
            key: 'gene-set-level-diff',
            label: '基因集水平差异',
            path: '/cell-communication-analysis/group-diff-comparison/gene-set',
          },
        ],
      },
    ],
  },
  {
    key: 'transcription-factor-analysis',
    label: '转录因子分析',
    path: '/transcription-factor-analysis',
    children: [
      {
        key: 'tf-gene-stats',
        label: 'TF-gene统计',
        path: '/transcription-factor-analysis/tf-gene-stats',
      },
      {
        key: 'regulons-activity-dimension-reduction',
        label: 'Regulons活性降维',
        path: '/transcription-factor-analysis/regulons-activity-dimension-reduction',
      },
      {
        key: 'regulons-activity-feature',
        label: 'Regulons活性特征',
        path: '/transcription-factor-analysis/regulons-activity-feature',
      },
      {
        key: 'regulons-openness-feature',
        label: 'Regulons开放性特征',
        path: '/transcription-factor-analysis/regulons-openness-feature',
      },
      {
        key: 'regulons-expression-feature',
        label: 'Regulons表达量特征',
        path: '/transcription-factor-analysis/regulons-expression-feature',
      },
      {
        key: 'tf-gene-interaction-network',
        label: 'TF-gene互作网络',
        path: '/transcription-factor-analysis/tf-gene-interaction-network',
      },
    ],
  },
  {
    key: 'group-diff-analysis',
    label: '组间差异分析',
    path: '/group-diff-analysis',
    children: [
      {
        key: 'deg-stats',
        label: '差异基因统计',
        path: '/group-diff-analysis/deg-stats',
      },
      {
        key: 'deg-distribution',
        label: '差异基因分布',
        path: '/group-diff-analysis/deg-distribution',
      },
      {
        key: 'deg-go-enrichment',
        label: '差异基因GO富集',
        path: '/group-diff-analysis/deg-go-enrichment',
      },
      {
        key: 'deg-kegg-enrichment',
        label: '差异基因KEGG富集',
        path: '/group-diff-analysis/deg-kegg-enrichment',
      },
      {
        key: 'gsea-analysis',
        label: 'GSEA分析',
        path: '/group-diff-analysis/gsea-analysis',
      },
    ],
  },
  {
    key: 'gene-set-scoring-analysis',
    label: '基因集打分分析',
    path: '/gene-set-scoring-analysis',
    children: [
      {
        key: 'gene-set-classification',
        label: '基因集分类',
        path: '/gene-set-scoring-analysis/gene-set-classification',
      },
      {
        key: 'positive-cell-analysis',
        label: '阳性细胞分析',
        path: '/gene-set-scoring-analysis/positive-cell-analysis',
      },
      {
        key: 'gene-set-assessment',
        label: '基因集评估',
        path: '/gene-set-scoring-analysis/gene-set-assessment',
      },
      {
        key: 'gene-distribution-in-set',
        label: '基因集中基因分布',
        path: '/gene-set-scoring-analysis/gene-distribution-in-set',
      },
      {
        key: 'gene-set-score-diff',
        label: '基因集评分差异',
        path: '/gene-set-scoring-analysis/gene-set-score-diff',
      },
    ],
  },
  {
    key: 'target-gene-analysis',
    label: '目标基因分析',
    path: '/target-gene-analysis',
    children: [
      {
        key: 'target-gene-venn',
        label: '目标基因韦恩图',
        path: '/target-gene-analysis/target-gene-venn',
      },
      {
        key: 'target-gene-go-enrichment',
        label: '目标基因GO富集',
        path: '/target-gene-analysis/target-gene-go-enrichment',
      },
      {
        key: 'target-gene-kegg-enrichment',
        label: '目标基因KEGG富集',
        path: '/target-gene-analysis/target-gene-kegg-enrichment',
      },
    ],
  },
  {
    key: 'database-analysis',
    label: '数据库分析',
    path: '/database-analysis',
    children: [
      {
        key: 'tcga-analysis',
        label: 'TCGA分析',
        path: '/database-analysis/tcga-analysis',
      },
    ],
  },
  {
    key: 'gene-query',
    label: '基因查询',
    path: '/gene-query',
    children: [
      {
        key: 'subgroup-task',
        label: '亚群类任务',
        path: '/gene-query/subgroup-task',
      },
      {
        key: 'group-diff-task',
        label: '组间差异任务',
        path: '/gene-query/group-diff-task',
      },
    ],
  },
  {
    key: 'graph-comparison',
    label: '图形比较',
    path: '/graph-comparison',
  },
  {
    key: 'task-overview',
    label: '任务总览',
    path: '/task-overview',
  },
  {
    key: 'analysis-report',
    label: '分析报告',
    path: '/analysis-report',
  },
  {
    key: 'custom-color-scheme',
    label: '个性配色方案',
    path: '/custom-color-scheme',
  },
  {
    key: 'exclusive-omicshare',
    label: '专属Omicshare',
    path: '/exclusive-omicshare',
    children: [
      {
        key: 'my-classroom',
        label: '我的课堂',
        path: '/exclusive-omicshare/my-classroom',
      },
      {
        key: 'my-tools',
        label: '我的工具',
        path: '/exclusive-omicshare/my-tools',
      },
      {
        key: 'my-knowledge-base',
        label: '我的知识库',
        path: '/exclusive-omicshare/my-knowledge-base',
      },
    ],
  },
  {
    key: 'feedback',
    label: '建议与反馈',
    path: '/feedback',
  },
];

// 获取所有一级导航
export const getFirstLevelNavigation = () => {
  return navigationConfig.map(item => ({
    key: item.key,
    label: item.label,
    path: item.path,
    hasChildren: !!item.children,
  }));
};

// 获取指定导航的子导航
export const getChildNavigation = (parentKey) => {
  const parent = navigationConfig.find(item => item.key === parentKey);
  return parent?.children || [];
};

// 递归搜索导航
export const searchNavigation = (keyword) => {
  if (!keyword) return navigationConfig;
  
  const lowerKeyword = keyword.toLowerCase();
  const results = [];
  
  const searchInNode = (node, parentPath = []) => {
    const currentPath = [...parentPath, node];
    const matches = node.label.toLowerCase().includes(lowerKeyword);
    
    if (matches) {
      results.push({
        ...node,
        path: currentPath,
      });
    }
    
    if (node.children) {
      node.children.forEach(child => searchInNode(child, currentPath));
    }
  };
  
  navigationConfig.forEach(node => searchInNode(node));
  return results;
};

// 根据key获取完整路径
export const getNavigationPath = (targetKey) => {
  const findPath = (nodes, key, path = []) => {
    for (const node of nodes) {
      const currentPath = [...path, node];
      if (node.key === key) {
        return currentPath;
      }
      if (node.children) {
        const found = findPath(node.children, key, currentPath);
        if (found) return found;
      }
    }
    return null;
  };
  
  return findPath(navigationConfig, targetKey);
};