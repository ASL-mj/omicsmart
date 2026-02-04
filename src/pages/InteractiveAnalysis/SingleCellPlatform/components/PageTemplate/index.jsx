import { useState, useEffect } from 'react';
import { Button, Space, Badge, message, Select } from 'antd';
import { InteractionOutlined, HistoryOutlined, SearchOutlined } from '@ant-design/icons';
import TaskDrawer from '../TaskDrawer';
import styles from './PageTemplate.module.css';
import { TaskApi, CellFilterApi } from '@/utils/api';

const { Option } = Select;

const PageTemplate = ({ 
  children, 
  pageTitle = '', 
  showButtons = true,
  showGeneSelectors = false,
}) => {
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [genesList, setGenesList] = useState([]);
  const [targetGene1, setTargetGene1] = useState(null);
  const [targetGene2, setTargetGene2] = useState(null);
  
  // 任务编号列表（固定数据）
  const taskNumberList = [
    {
      "task_number": "default_pipeline",
      "task_name": "tenx44712YkRAEhY",
      "task_id": "44712"
    },
    {
      "task_number": "default_original",
      "task_name": "tenx44812qvBVokG",
      "task_id": "44812"
    },
    {
      "task_number": "test",
      "task_name": "tenx54416cCRDOmH",
      "task_id": "54416"
    },
    {
      "task_number": "4123315073",
      "task_name": "tenx86364olZVLHo",
      "task_id": "86364"
    },
    {
      "task_number": "test_1115",
      "task_name": "tenx87768AdEMXln",
      "task_id": "87768"
    },
    {
      "task_number": "1127",
      "task_name": "tenx89470LbxujVu",
      "task_id": "89470"
    }
  ];
  
  const [selectedTaskId, setSelectedTaskId] = useState(taskNumberList[0]?.task_id || null);

  const onInteractiveAnalysis = () => {
    message.info('开始交互分析 - 目标细胞集筛选');
  };

  // 处理查询按钮点击
  const handleQuery = () => {
    if (!targetGene1 && !targetGene2) {
      message.warning('请至少选择一个目标基因');
      return;
    }
    
    const gene1Info = genesList.find(g => g[0] === targetGene1);
    const gene2Info = genesList.find(g => g[0] === targetGene2);
    
    let queryInfo = '查询基因: ';
    if (gene1Info) queryInfo += `${gene1Info[1]} (${gene1Info[0]})`;
    if (gene1Info && gene2Info) queryInfo += ' 和 ';
    if (gene2Info) queryInfo += `${gene2Info[1]} (${gene2Info[0]})`;
    
    message.success(queryInfo);
    // 这里可以添加实际的查询逻辑
  };

  // 获取任务列表
  const fetchTaskLists = async () => {
    try {
      const response = await TaskApi.getTaskLists();
      
      if (response.status === 1) {
        const taskList = (response.result?.group || []).map(task => ({
          id: task.task_id,
          name: task.task_number || task.task_name,
          status:
            task.task_status === 'C' ? 'success' :
            task.task_status === 'E' ? 'failed' :
            task.task_status === 'R' ? 'running' : 'pending',
          taskType: task.task_type,
        }));

        setTasks(taskList);
      } else {
        console.error('获取任务列表失败:', response.msg);
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
    }
  };

  useEffect(() => {
    // 使用setTimeout避免同步设置状态
    setTimeout(() => {
      fetchTaskLists();
    }, 0);
  }, []);

  // 当任务ID变化时，重新获取基因列表（仅在需要显示基因选择器时）
  useEffect(() => {
    if (!showGeneSelectors) return;
    
    const fetchGenesList = async () => {
      if (!selectedTaskId) return;
      
      try {
        const response = await CellFilterApi.getAllGenes({
          task_id: selectedTaskId
        });
        
        if (response.status === 1 && response.result) {
          // 数据格式: [["ENSG00000243485", "RP11-34P13.3"], ...]
          setGenesList(response.result);
        } else {
          console.error('获取基因列表失败:', response.msg);
        }
      } catch (error) {
        console.error('获取基因列表失败:', error);
      }
    };

    fetchGenesList();
  }, [selectedTaskId, showGeneSelectors]);

  // 处理任务编号切换
  const handleTaskChange = (taskId) => {
    setSelectedTaskId(taskId);
    setTargetGene1(null);
    setTargetGene2(null);
    const selectedTask = taskNumberList.find(t => t.task_id === taskId);
    if (selectedTask) {
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
              
              {showGeneSelectors && (
                <>
                  <Space>
                    <span style={{ fontSize: 14, color: '#666' }}>目标基因1:</span>
                    <Select
                      value={targetGene1}
                      onChange={setTargetGene1}
                      style={{ width: 200 }}
                      placeholder="请选择目标基因1"
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {genesList.map(gene => (
                        <Option key={gene[0]} value={gene[0]}>
                          {gene[1]} ({gene[0]})
                        </Option>
                      ))}
                    </Select>
                  </Space>
                  
                  <Space>
                    <span style={{ fontSize: 14, color: '#666' }}>目标基因2:</span>
                    <Select
                      value={targetGene2}
                      onChange={setTargetGene2}
                      style={{ width: 200 }}
                      placeholder="请选择目标基因2"
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {genesList.map(gene => (
                        <Option key={gene[0]} value={gene[0]}>
                          {gene[1]} ({gene[0]})
                        </Option>
                      ))}
                    </Select>
                  </Space>
                  
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    onClick={handleQuery}
                  >
                    查询
                  </Button>
                </>
              )}
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