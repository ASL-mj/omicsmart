import { useState } from 'react';
import { Button, Space, Badge } from 'antd';
import { InteractionOutlined, HistoryOutlined } from '@ant-design/icons';
import TaskDrawer from './TaskDrawer';
import styles from './PageTemplate.module.css';

const PageTemplate = ({ 
  children, 
  pageTitle = '', 
  showButtons = true, 
  onInteractiveAnalysis,
  tasks = [] // 任务列表数据
}) => {
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);

  // 计算运行中的任务数量
  const runningTaskCount = tasks.filter(t => t.status === 'running').length;

  return (
    <div className={styles.pageTemplate}>
      <div className={styles.headerWithButtons}>
        <div className={styles.pageTitle}>
          <h2>{pageTitle}</h2>
        </div>
        
        {showButtons && (
          <div className={styles.buttonGroup}>
            <Space size="small">
              <Button 
                type="primary" 
                icon={<InteractionOutlined />}
                onClick={onInteractiveAnalysis}
              >
                开始交互分析
              </Button>
              <Badge count={runningTaskCount} offset={[-5, 5]}>
                <Button 
                  icon={<HistoryOutlined />}
                  onClick={() => setTaskDrawerOpen(true)}
                >
                  任务状态
                </Button>
              </Badge>
            </Space>
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        {children}
      </div>

      {/* 任务浮动面板 */}
      <TaskDrawer
        visible={taskDrawerOpen}
        onClose={() => setTaskDrawerOpen(false)}
        tasks={tasks}
      />
    </div>
  );
};

export default PageTemplate;