import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AnalysisPlatformPage from '../pages/AnalysisPlatformPage';
import PlatformDetailPage from '../pages/AnalysisPlatform';
import SingleCellInteractiveAnalysis from '../pages/InteractiveAnalysis/SingleCellPlatform/index.jsx';
import MicrobiomeInteractiveAnalysis from '../pages/InteractiveAnalysis/MicrobiomePlatform/index.jsx'



// 路由配置
export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/analysis" replace />,
      },
      {
        path: 'analysis',
        element: <AnalysisPlatformPage />,
      },
      {
        path: 'analysis/:id',
        element: <PlatformDetailPage />,
      },
      {
        path: 'project-progress',
        element: (
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>项目进度</h2>
            <p>项目进度管理功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'project-results',
        element: (
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>项目结果</h2>
            <p>项目结果管理功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'project-relation',
        element: (
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>项目关联</h2>
            <p>项目关联管理功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'tasks',
        element: (
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>我的任务</h2>
            <p>任务管理功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'forms',
        element: (
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>我的表单</h2>
            <p>表单管理功能开发中...</p>
          </div>
        ),
      },
      {
        path: 'raw-data',
        element: (
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
            <h2>原始数据分析</h2>
            <p>原始数据分析功能开发中...</p>
          </div>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/analysis" replace />,
      },
    ],
  },
  // 结果交互分析页面 - 独立路由，不使用MainLayout
  {
    path: '/interactive-analysis/single-cell/*',
    element: <SingleCellInteractiveAnalysis />,
  },
  {
    path: '/interactive-analysis/microbiome/*',
    element: <MicrobiomeInteractiveAnalysis />,
  },
];
