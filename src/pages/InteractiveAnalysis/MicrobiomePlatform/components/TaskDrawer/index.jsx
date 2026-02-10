import { Button, Empty, Space, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import { useState } from 'react';

const TaskDrawer = ({ visible, onClose, tasks = [] }) => {
  // 任务状态配置
  const statusDotClass = {
    success: styles.dotSuccess,
    running: styles.dotRunning,
    failed: styles.dotFailed,
    pending: styles.dotPending,
  };

  // 状态标签文本
  const statusText = {
    success: '成功',
    running: '运行中',
    failed: '失败',
    pending: '等待中',
  };

  // 状态管理：控制哪些任务被展开
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  // 切换任务展开状态
  const toggleTaskExpand = (taskId) => {
    const newExpandedTasks = new Set(expandedTasks);
    if (newExpandedTasks.has(taskId)) {
      newExpandedTasks.delete(taskId);
    } else {
      newExpandedTasks.add(taskId);
    }
    setExpandedTasks(newExpandedTasks);
  };

  return (
    <div className={`${styles.taskPanel} ${visible ? styles.visible : ''}`}>
      {/* 头部 */}
      <div className={styles.panelHeader}>
        <h3>任务列表</h3>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={onClose}
          className={styles.closeBtn}
        />
      </div>

      {/* 图例说明 */}
      <div className={styles.legend} style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Space size="large">
          {Object.keys(statusDotClass).map((status) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center' }}>
              <span
                className={`${styles.statusDot} ${statusDotClass[status]}`}
                style={{ marginRight: '4px' }}
              />
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{statusText[status]}</span>
            </div>
          ))}
        </Space>
      </div>

      {/* 内容 */}
      <div className={styles.panelContent}>
        {tasks.length === 0 ? (
          <Empty
            description="暂无任务"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div>
            {tasks.map((task) => {
              const expanded = expandedTasks.has(task.id);

              return (
                <div key={task.id} className={styles.taskItem}>
                  {/* 主行 */}
                  <div
                    className={styles.taskRow}
                    onClick={() => toggleTaskExpand(task.id)}
                  >
                    <span
                      className={`${styles.statusDot} ${statusDotClass[task.status]}`}
                    />
                    <span className={styles.taskName}>{task.name}</span>
                  </div>

                  {/* 展开内容 */}
                  {expanded && task.taskType && (
                    <div className={styles.taskType}>
                      {task.taskType.split('、').map((type, index) => (
                        <div key={index} style={{ marginLeft: '18px', marginBottom: '4px' }}>
                          <Tag color="blue" style={{ marginBottom: '0' }}>{type.trim()}</Tag>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDrawer;