import { useState, useEffect } from 'react';
import { Button, Space, Badge, message, Select } from 'antd';
import { InteractionOutlined, HistoryOutlined } from '@ant-design/icons';
import TaskDrawer from '../TaskDrawer';
import styles from './PageTemplate.module.css';

const { Option } = Select;

const PageTemplate = ({ 
  children, 
  pageTitle = '', 
  showButtons = true,
}) => {
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskNumberList, setTaskNumberList] = useState([]);
  
  // 初始化时从sessionStorage读取选中的任务ID
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    return sessionStorage.getItem('selectedMicrobiomeTaskId') || null;
  });

  const onInteractiveAnalysis = () => {
    // 跳转到新建任务页面或打开任务创建对话框
    message.info('开始交互分析功能开发中...');
  };

  // 获取任务列表
  const fetchTaskLists = async () => {
    try {
      // TODO: 替换为实际的微生物平台API
      // const response = await MicrobiomeTaskApi.getTaskLists();
      
      // 模拟数据
      const mockTasks = [
        {
          task_id: '1',
          task_number: 'MB001',
          task_name: '微生物分析任务1',
          task_status: 'C',
          task_type: '物种组成分析、Alpha多样性分析',
        },
        {
          task_id: '2',
          task_number: 'MB002',
          task_name: '微生物分析任务2',
          task_status: 'R',
          task_type: 'Beta多样性分析、功能分析',
        },
      ];

      // 用于任务状态抽屉的任务列表
      const taskList = mockTasks.map(task => ({
        id: task.task_id,
        name: task.task_number || task.task_name,
        status:
          task.task_status === 'C' ? 'success' :
          task.task_status === 'E' ? 'failed' :
          task.task_status === 'R' ? 'running' : 'pending',
        taskType: task.task_type,
      }));

      // 用于任务编号下拉框的任务列表
      const taskNumbers = mockTasks.map(task => ({
        task_id: task.task_id,
        task_number: task.task_number || task.task_name,
        task_name: task.task_name,
      }));

      setTasks(taskList);
      setTaskNumberList(taskNumbers);
      
      // 如果还没有选中任务，默认选择第一个
      if (!selectedTaskId && taskNumbers.length > 0) {
        setSelectedTaskId(taskNumbers[0].task_id);
        sessionStorage.setItem('selectedMicrobiomeTaskId', taskNumbers[0].task_id);
        sessionStorage.setItem('selectedMicrobiomeTaskNumber', taskNumbers[0].task_number);
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);

  // 处理任务编号切换
  const handleTaskChange = (taskId) => {
    setSelectedTaskId(taskId);
    // 同时更新sessionStorage
    sessionStorage.setItem('selectedMicrobiomeTaskId', taskId);
    const selectedTask = taskNumberList.find(t => t.task_id === taskId);
    if (selectedTask) {
      sessionStorage.setItem('selectedMicrobiomeTaskNumber', selectedTask.task_number);
      message.success(`已切换到任务: ${selectedTask.task_number}`);
    }
  };

  // 计算运行中的任务数量
  const runningTaskCount = tasks.filter(t => t.status === 'running').length;

  return (
    <div className={styles.pageTemplate}>
      <div className={styles.headerWithButtons}>
        <div className={styles.pageTitle}>
          <h2>{pageTitle}</h2>
          <div style={{ marginLeft: 24 }}>
            <Space size="middle">
              <Space>
                <span style={{ fontSize: 14, color: '#666' }}>任务编号:</span>
                <Select
                  value={selectedTaskId}
                  onChange={handleTaskChange}
                  style={{ width: 200 }}
                  placeholder="请选择任务编号"
                >
                  {taskNumberList.map(task => (
                    <Option key={task.task_id} value={task.task_id}>
                      {task.task_number}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Space>
          </div>
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