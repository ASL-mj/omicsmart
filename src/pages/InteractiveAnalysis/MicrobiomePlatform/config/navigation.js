import {
  SearchOutlined,
  FileTextOutlined,
  SafetyOutlined,
  TeamOutlined,
  FilterOutlined,
  PieChartOutlined,
  BulbOutlined,
  BarChartOutlined,
  DotChartOutlined,
  FunctionOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

/**
 * 微生物平台导航配置
 */
export const navigationConfig = [
  {
    key: 'report-navigation',
    label: '报告导航',
    icon: FileTextOutlined,
    path: '/interactive-analysis/microbiome/report-navigation',
  },
  {
    key: 'qc-report',
    label: '质控报告',
    icon: SafetyOutlined,
    path: '/interactive-analysis/microbiome/qc-report',
  },
  {
    key: 'group-scheme',
    label: '分组方案',
    icon: TeamOutlined,
    path: '/interactive-analysis/microbiome/group-scheme',
  },
  {
    key: 'otu-filter',
    label: 'OTU筛选',
    icon: FilterOutlined,
    path: '/interactive-analysis/microbiome/otu-filter',
  },
  {
    key: 'species-composition',
    label: '物种组成分析',
    icon: PieChartOutlined,
    path: '/interactive-analysis/microbiome/species-composition',
  },
  {
    key: 'indicator-species',
    label: '指示物种分析',
    icon: BulbOutlined,
    path: '/interactive-analysis/microbiome/indicator-species',
  },
  {
    key: 'alpha-diversity',
    label: 'Alpha多样性分析',
    icon: BarChartOutlined,
    path: '/interactive-analysis/microbiome/alpha-diversity',
  },
  {
    key: 'beta-diversity',
    label: 'Beta多样性分析',
    icon: DotChartOutlined,
    path: '/interactive-analysis/microbiome/beta-diversity',
  },
  {
    key: 'functional-analysis',
    label: '功能分析',
    icon: FunctionOutlined,
    path: '/interactive-analysis/microbiome/functional-analysis',
    children: [
      {
        key: 'picrust2',
        label: 'PICRUSt2',
        path: '/interactive-analysis/microbiome/functional-analysis/picrust2',
      },
      {
        key: 'bugbase',
        label: 'BugBase',
        path: '/interactive-analysis/microbiome/functional-analysis/bugbase',
      },
      {
        key: 'faprotax',
        label: 'FAPROTAX',
        path: '/interactive-analysis/microbiome/functional-analysis/faprotax',
      },
    ],
  },
  {
    key: 'environmental-factors',
    label: '环境因子分析',
    icon: ExperimentOutlined,
    path: '/interactive-analysis/microbiome/environmental-factors',
  },
  {
    key: 'microbiome-query',
    label: '微生物特征查询',
    icon: DatabaseOutlined,
    path: '/interactive-analysis/microbiome/microbiome-query',
    children: [
      {
        key: 'species-query',
        label: '物种查询',
        path: '/interactive-analysis/microbiome/microbiome-query/species',
      },
      {
        key: 'sample-group-query',
        label: '样本/分组查询',
        path: '/interactive-analysis/microbiome/microbiome-query/sample-group',
      },
    ],
  },
];

export default navigationConfig;