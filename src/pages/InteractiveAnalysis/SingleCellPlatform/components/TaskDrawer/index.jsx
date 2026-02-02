import { List, Tag, Progress, Button, Space, Empty } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  SyncOutlined,
  ReloadOutlined,
  CloseOutlined
} from '@ant-design/icons';
import styles from './index.module.css';

const TaskDrawer = ({ visible, onClose, tasks = [] }) => {
  // 任务状态配置
  const statusConfig = {
    pending: {
      label: '等待中',
      color: 'default',
      icon: <ClockCircleOutlined />,
    },
    running: {
      label: '运行中',
      color: 'processing',
      icon: <SyncOutlined spin />,
    },
    success: {
      label: '已完成',
      color: 'success',
      icon: <CheckCircleOutlined />,
    },
    failed: {
      label: '失败',
      color: 'error',
      icon: <CloseCircleOutlined />,
    },
  };

  // 处理任务重试
  const handleRetry = (taskId) => {
    console.log('重试任务:', taskId);
  };

  // 处理任务取消
  const handleCancel = (taskId) => {
    console.log('取消任务:', taskId);
  };

  // 处理查看详情
  const handleViewDetail = (taskId) => {
    console.log('查看任务详情:', taskId);
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

      {/* 内容 */}
      <div className={styles.panelContent}>
        {tasks.length === 0 ? (
          <Empty
            description="暂无任务"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={tasks}
            renderItem={(task) => {
              const status = statusConfig[task.status] || statusConfig.pending;
              
              return (
                <List.Item className={styles.taskItem}>
                  <div className={styles.taskCard}>
                    {/* 任务头部 */}
                    <div className={styles.taskHeader}>
                      <div className={styles.taskTitle}>
                        <span className={styles.taskIcon}>{status.icon}</span>
                        <span className={styles.taskName}>{task.name}</span>
                      </div>
                      <Tag color={status.color}>{status.label}</Tag>
                    </div>

                    {/* 任务信息 */}
                    <div className={styles.taskInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>任务ID:</span>
                        <span className={styles.infoValue}>{task.id}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>创建时间:</span>
                        <span className={styles.infoValue}>{task.createTime}</span>
                      </div>
                      {task.finishTime && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>完成时间:</span>
                          <span className={styles.infoValue}>{task.finishTime}</span>
                        </div>
                      )}
                    </div>

                    {/* 进度条 */}
                    {task.status === 'running' && task.progress !== undefined && (
                      <div className={styles.taskProgress}>
                        <Progress 
                          percent={task.progress} 
                          status="active"
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                        />
                      </div>
                    )}

                    {/* 错误信息 */}
                    {task.status === 'failed' && task.errorMessage && (
                      <div className={styles.errorMessage}>
                        <span className={styles.errorLabel}>错误信息:</span>
                        <span className={styles.errorText}>{task.errorMessage}</span>
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className={styles.taskActions}>
                      <Space size="small">
                        {task.status === 'success' && (
                          <Button 
                            type="primary" 
                            size="small"
                            onClick={() => handleViewDetail(task.id)}
                          >
                            查看结果
                          </Button>
                        )}
                        {task.status === 'failed' && (
                          <Button 
                            type="primary" 
                            size="small"
                            icon={<ReloadOutlined />}
                            onClick={() => handleRetry(task.id)}
                          >
                            重试
                          </Button>
                        )}
                        {task.status === 'running' && (
                          <Button 
                            danger 
                            size="small"
                            onClick={() => handleCancel(task.id)}
                          >
                            取消
                          </Button>
                        )}
                        <Button 
                          size="small"
                          onClick={() => handleViewDetail(task.id)}
                        >
                          详情
                        </Button>
                      </Space>
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskDrawer;