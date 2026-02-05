import React, { useState } from 'react';
import { Tabs, Form, Input, Select, Button, Space, message, Checkbox, InputNumber, Radio, Row, Col, Card, Divider } from 'antd';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import styles from './CreateTask.module.css';

const { TextArea } = Input;
const { Option } = Select;

const CreateTask = () => {
  const [activeTab, setActiveTab] = useState('process');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // 拟时分析的子Tab
  const [pseudotimeSubTab, setPseudotimeSubTab] = useState('basic');
  // 基因集打分的子Tab
  const [scoringSubTab, setScoringSubTab] = useState('basic');

  // 提交表单
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // TODO: 调用创建任务API
      console.log('创建任务参数:', { taskType: activeTab, pseudotimeSubTab, ...values });
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('任务创建成功');
      form.resetFields();
      
      // 返回任务列表页面
      setTimeout(() => {
        window.location.hash = '#task-overview';
      }, 500);
    } catch (error) {
      console.error('创建任务失败:', error);
      message.error('创建任务失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // Tab切换时重置表单
  const handleTabChange = (key) => {
    setActiveTab(key);
    form.resetFields();
  };

  // 流程任务表单
  const renderProcessForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
      initialValues={{
        qcChecked: true,
        subgroupChecked: true,
        frequencyChecked: true,
        batchEffect: 'harmony',
        resolution: 0.5,
        upregulatedLogfcType: 'logfc',
        upregulatedLogfc: 1.284,
        upregulatedPvalueType: 'pvalue',
        upregulatedPvalue: 0.01,
        upregulatedMinpct: 0.25
      }}
    >
      {/* 基础配置区 */}
      <Col span={6}>
        <Form.Item
          label="分组方案"
          name="groupScheme"
          rules={[{ required: true, message: '请选择分组方案' }]}
        >
          <Select placeholder="请选择分组方案（如对照 vs 处理）">
            <Option value="control_vs_treatment">对照 vs 处理</Option>
            <Option value="time_series">时间序列</Option>
            <Option value="custom">自定义分组</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          label="流程细胞集"
          name="processCellSet"
          rules={[{ required: true, message: '请选择流程细胞集' }]}
        >
          <Select placeholder="请选择用于分析的细胞数据集">
            <Option value="cellset1">细胞集1</Option>
            <Option value="cellset2">细胞集2</Option>
          </Select>
        </Form.Item>
      </Col>

      {/* 嵌套参数分析区 */}
      <div className={styles.analysisSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>分析项目</span>
          <span className={styles.estimatedTime}>预估分析时间：30分钟~2天</span>
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">

          {/* 细胞质控总览 */}
          <Form.Item name="qcChecked" valuePropName="checked" initialValue={true} noStyle>
            <Checkbox disabled checked>细胞质控总览</Checkbox>
          </Form.Item>

          {/* 细胞亚群分类分析 */}
          <div className={styles.analysisItem}>
            <Row align="middle" gutter={16}>
              <Col>
                <Form.Item name="subgroupChecked" valuePropName="checked" initialValue={true} noStyle>
                  <Checkbox disabled checked>细胞亚群分类分析</Checkbox>
                </Form.Item>
              </Col>
              <Col flex="auto">
                <Row gutter={12} align="middle">
                  <Col>
                    <span className={styles.paramLabel}>批次效应</span>
                  </Col>
                  <Col>
                    <Form.Item name="batchEffect" noStyle>
                      <Select size="small" style={{ width: 120 }}>
                        <Option value="harmony">Harmony</Option>
                        <Option value="combat">ComBat</Option>
                        <Option value="none">不校正</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <span className={styles.paramLabel}>分辨率</span>
                  </Col>
                  <Col>
                    <Form.Item name="resolution" noStyle>
                      <InputNumber size="small" min={0.1} max={2} step={0.1} style={{ width: 80 }} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <span className={styles.paramLabel}>聚类基因集</span>
                  </Col>
                  <Col>
                    <Form.Item name="clusterGeneSet" noStyle>
                      <Select size="small" style={{ width: 120 }} placeholder="请选择">
                        <Option value="hvg">选项一</Option>
                        <Option value="custom">选项二</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <span className={styles.paramLabel}>聚类算法</span>
                  </Col>
                  <Col>
                    <Form.Item name="clusterGeneSet" noStyle>
                      <Select size="small" style={{ width: 120 }} placeholder="请选择">
                        <Option value="hvg">选项一</Option>
                        <Option value="custom">选项二</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          {/* 亚群marker基因分析 */}
          <Form.Item name="markerChecked" valuePropName="checked" noStyle>
          <Checkbox>亚群marker基因分析</Checkbox>
          </Form.Item>

          {/* 亚群上调基因分析 - 带条件渲染 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.upregulatedChecked !== currentValues.upregulatedChecked
            }
          >
            {({ getFieldValue }) => {
              const upregulatedChecked = getFieldValue('upregulatedChecked');
              return (
                <div className={styles.analysisItem}>
                  <Row align="middle" gutter={16}>
                    <Col>
                      <Form.Item name="upregulatedChecked" valuePropName="checked" noStyle>
                        <Checkbox>亚群上调基因分析</Checkbox>
                      </Form.Item>
                    </Col>
                    {upregulatedChecked && (
                      <Col flex="auto">
                        <Space size="middle">
                          <Space size="small">
                            <Form.Item name="upregulatedLogfcType" initialValue="logfc" noStyle>
                              <Select size="small" style={{ width: 100 }}>
                                <Option value="logfc">差异倍数</Option>
                                <Option value="log2fc">log2FC</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item name="upregulatedLogfc" initialValue={1.284} noStyle>
                              <InputNumber size="small" min={0} step={0.1} style={{ width: 80 }} />
                            </Form.Item>
                          </Space>
                          <Space size="small">
                            <Form.Item name="upregulatedPvalueType" initialValue="pvalue" noStyle>
                              <Select size="small" style={{ width: 100 }}>
                                <Option value="pvalue">P值</Option>
                                <Option value="adjpvalue">adj.P值</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item name="upregulatedPvalue" initialValue={0.01} noStyle>
                              <InputNumber size="small" min={0} max={1} step={0.01} style={{ width: 80 }} />
                            </Form.Item>
                          </Space>
                          <Space size="small">
                            <span className={styles.paramLabel}>min.pct</span>
                            <Form.Item name="upregulatedMinpct" initialValue={0.25} noStyle>
                              <InputNumber size="small" min={0} max={1} step={0.01} style={{ width: 80 }} />
                            </Form.Item>
                          </Space>
                        </Space>
                      </Col>
                    )}
                  </Row>
                  {upregulatedChecked && (
                    <Row gutter={16} style={{ marginTop: 12 }}>
                      <Col>
                        <Form.Item name="upregulatedGo" valuePropName="checked" noStyle>
                          <Checkbox>亚群上调基因GO富集分析</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item name="upregulatedKegg" valuePropName="checked" noStyle>
                          <Checkbox>亚群上调基因KEGG富集分析</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </div>
              );
            }}
          </Form.Item>

          {/* 细胞频率差异选项 */}
          <Form.Item name="frequencyChecked" valuePropName="checked" initialValue={true} noStyle>
          <Checkbox disabled checked>细胞频率差异</Checkbox>
          </Form.Item>
        </Space>
      </div>

          {/* 底部提交栏 */}
      <div className={styles.submitSection}>
        <Space size="middle" align="center">
          <span className={styles.paramLabel}>任务编号</span>
          <Form.Item 
            name="taskNumber" 
            rules={[{ required: true, message: '请输入任务编号' }]}
            noStyle
          >
            <Input placeholder="请输入任务编号" style={{ width: 200 }} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认并创建
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>
    </Form>
  );

  // 再分群分析任务表单
  const renderReClusterForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
      initialValues={{
        batchEffect: 'harmony',
        resolution: 0.5,
        hvgCount: 1000
      }}
    >
      {/* 基础配置区 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="分组方案"
            name="groupScheme"
            rules={[{ required: true, message: '请选择分组方案' }]}
          >
            <Select placeholder="请选择分组方案（如对照 vs 处理）">
              <Option value="control_vs_treatment">对照 vs 处理</Option>
              <Option value="time_series">时间序列</Option>
              <Option value="custom">自定义分组</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="目标细胞集"
            name="targetCellSet"
            rules={[{ required: true, message: '请选择目标细胞集' }]}
          >
            <Select placeholder="请选择要重新分析的细胞数据集">
              <Option value="cellset1">细胞集1</Option>
              <Option value="cellset2">细胞集2</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* 嵌套参数分析区 */}
      <div className={styles.analysisSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>分析项目</span>
          <span className={styles.estimatedTime}>预估分析时间：30分钟~2天</span>
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* 细胞亚群分类分析 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.subgroupChecked !== currentValues.subgroupChecked
            }
          >
            {({ getFieldValue }) => {
              const subgroupChecked = getFieldValue('subgroupChecked');
              return (
                <div className={styles.analysisItem}>
                  <Row align="middle" gutter={16}>
                    <Col>
                      <Form.Item name="subgroupChecked" valuePropName="checked" noStyle>
                        <Checkbox>细胞亚群分类分析</Checkbox>
                      </Form.Item>
                    </Col>
                    {subgroupChecked && (
                      <Col flex="auto">
                        <Row gutter={12} align="middle">
                          <Col>
                            <span className={styles.paramLabel}>批次效应</span>
                          </Col>
                          <Col>
                            <Form.Item name="batchEffect" noStyle>
                              <Select size="small" style={{ width: 120 }}>
                                <Option value="harmony">Harmony</Option>
                                <Option value="combat">ComBat</Option>
                                <Option value="none">不校正</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col>
                            <span className={styles.paramLabel}>分辨率</span>
                          </Col>
                          <Col>
                            <Form.Item name="resolution" noStyle>
                              <InputNumber size="small" min={0.1} max={2} step={0.1} style={{ width: 80 }} />
                            </Form.Item>
                          </Col>
                          <Col>
                            <span className={styles.paramLabel}>聚类基因集</span>
                          </Col>
                          <Col>
                            <Form.Item name="reClusterGeneSet" noStyle>
                              <Select size="small" style={{ width: 180 }} placeholder="请选择">
                                <Option value="recalculate">重新计算高变基因</Option>
                                <Option value="inherit">继承原有高变基因</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col>
                            <span className={styles.paramLabel}>聚类算法</span>
                          </Col>
                          <Col>
                            <Form.Item name="clusterAlgorithm" noStyle>
                              <Select size="small" style={{ width: 120 }} placeholder="请选择">
                                <Option value="louvain">Louvain</Option>
                                <Option value="leiden">Leiden</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                  {subgroupChecked && (
                    <Row gutter={16} style={{ marginTop: 12 }}>
                      <Col>
                        <Space size="small">
                          <span className={styles.paramLabel}>高变基因数量</span>
                          <Form.Item name="hvgCount" noStyle>
                            <InputNumber size="small" min={500} max={5000} step={100} style={{ width: 100 }} />
                          </Form.Item>
                        </Space>
                      </Col>
                    </Row>
                  )}
                </div>
              );
            }}
          </Form.Item>

          {/* 亚群marker基因分析 */}
          <Form.Item name="markerChecked" valuePropName="checked" noStyle>
            <Checkbox>亚群marker基因分析</Checkbox>
          </Form.Item>

          {/* 亚群上调基因分析 */}
          <Form.Item name="upregulatedChecked" valuePropName="checked" noStyle>
            <Checkbox>亚群上调基因分析</Checkbox>
          </Form.Item>

          {/* 细胞频率差异 */}
          <Form.Item name="frequencyChecked" valuePropName="checked" noStyle>
            <Checkbox>细胞频率差异</Checkbox>
          </Form.Item>
        </Space>
      </div>

      {/* 底部提交栏 */}
      <div className={styles.submitSection}>
        <Space size="middle" align="center">
          <span className={styles.paramLabel}>任务编号</span>
          <Form.Item 
            name="taskNumber" 
            rules={[{ required: true, message: '请输入任务编号' }]}
            noStyle
          >
            <Input placeholder="请输入任务编号" style={{ width: 200 }} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认并创建
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>
    </Form>
  );

  // 细胞注释任务表单
  const renderCellAnnotationForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="任务编号"
        name="taskNumber"
        rules={[{ required: true, message: '请输入任务编号' }]}
      >
        <Input placeholder="请输入或选择已有任务" />
      </Form.Item>

      <Form.Item
        label="分组方案"
        name="groupScheme"
        rules={[{ required: true, message: '请选择分组方案' }]}
      >
        <Select placeholder="请选择分组方案">
          <Option value="control_vs_treatment">对照 vs 处理</Option>
          <Option value="time_series">时间序列</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="软件选择"
        name="annotationSoftware"
        rules={[{ required: true, message: '请选择注释软件' }]}
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="singleR">singleR（基于表达矩阵相关性匹配）</Radio>
            <Radio value="cellassign">cellassign（基于marker基因表达量）</Radio>
            <Radio value="ai">AI（deepseek R1智能注释）</Radio>
            <Radio value="celltypist">celltypist（预训练分类器）</Radio>
            <Radio value="popv">popv（多模型集成预测）</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="数据库选择"
        name="database"
      >
        <Select placeholder="请选择参考数据库">
          <Option value="existing">已有参考数据库</Option>
          <Option value="custom">自定义数据库</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="物种类型"
        name="species"
      >
        <Select placeholder="请选择物种类型">
          <Option value="human">人类</Option>
          <Option value="mouse">小鼠</Option>
          <Option value="other">其他</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="组织类型"
        name="tissueType"
      >
        <Select placeholder="请选择组织类型">
          <Option value="pbmc">PBMC</Option>
          <Option value="brain">脑组织</Option>
          <Option value="liver">肝脏</Option>
          <Option value="other">其他</Option>
        </Select>
      </Form.Item>

      {renderFormButtons()}
    </Form>
  );

  // 拟时分析 - 基础拟时分析表单
  const renderBasicPseudotimeForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="目标细胞集"
        name="targetCellSet"
        rules={[{ required: true, message: '请选择目标细胞集' }]}
      >
        <Select placeholder="请选择待分析的细胞群体">
          <Option value="cellset1">细胞集1</Option>
          <Option value="cellset2">细胞集2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="分组方案"
        name="groupScheme"
        rules={[{ required: true, message: '请选择分组方案' }]}
      >
        <Select placeholder="请选择实验分组">
          <Option value="control_vs_treatment">对照 vs 处理</Option>
          <Option value="time_series">时间序列</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="软件选择"
        name="software"
        initialValue="monocle2"
      >
        <Select placeholder="请选择拟时分析工具">
          <Option value="monocle2">Monocle2（经典拟时分析）</Option>
          <Option value="monocle3">Monocle3</Option>
          <Option value="slingshot">Slingshot</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="关联任务"
        name="relatedTask"
      >
        <Select placeholder="请选择上游任务">
          <Option value="task1">聚类任务1</Option>
          <Option value="task2">聚类任务2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="基因集选择"
        name="geneSet"
      >
        <Select placeholder="请选择用于拟时分析的基因集合">
          <Option value="hvg">标准流程高变基因</Option>
          <Option value="custom">自定义基因集</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="高变基因来源"
        name="hvgSource"
      >
        <Select placeholder="请指定高变基因来源任务">
          <Option value="task1">任务1</Option>
          <Option value="task2">任务2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="分析项目"
        name="analysisProjects"
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox value="trajectory">细胞轨迹分析</Checkbox>
            <Checkbox value="pseudotime_deg">拟时间轴差异基因分析</Checkbox>
            <Checkbox value="state_deg">分化状态差异基因分析</Checkbox>
            <Checkbox value="fate_deg">分化命运差异基因分析</Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="新任务编号"
        name="newTaskNumber"
        rules={[{ required: true, message: '请输入新任务编号' }]}
      >
        <Input placeholder="请输入新任务编号" />
      </Form.Item>

      {renderFormButtons()}
    </Form>
  );

  // 拟时分析 - 个性化拟时分析表单
  const renderCustomPseudotimeForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="任务编号"
        name="taskNumber"
        rules={[{ required: true, message: '请选择任务编号' }]}
      >
        <Select placeholder="请从已有任务中选择">
          <Option value="task1">任务1</Option>
          <Option value="task2">任务2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="目标细胞集"
        name="targetCellSet"
        rules={[{ required: true, message: '请选择目标细胞集' }]}
      >
        <Select placeholder="请指定分析对象">
          <Option value="cellset1">细胞集1</Option>
          <Option value="cellset2">细胞集2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="分组方案"
        name="groupScheme"
        rules={[{ required: true, message: '请选择分组方案' }]}
      >
        <Select placeholder="请选择实验设计分组">
          <Option value="control_vs_treatment">对照 vs 处理</Option>
          <Option value="time_series">时间序列</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="关联任务"
        name="relatedTask"
      >
        <Select placeholder="请连接上游任务">
          <Option value="task1">任务1</Option>
          <Option value="task2">任务2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="自定义分析内容"
        name="customAnalysis"
        tooltip="此模式允许用户自定义分析内容，可通过脚本或高级参数设置"
      >
        <TextArea 
          rows={6} 
          placeholder="请输入自定义分析脚本或参数配置"
        />
      </Form.Item>

      <Form.Item
        label="新任务编号"
        name="newTaskNumber"
        rules={[{ required: true, message: '请输入新任务编号' }]}
      >
        <Input placeholder="请输入新任务编号" />
      </Form.Item>

      {renderFormButtons()}
    </Form>
  );

  // 拟时分析表单（包含子Tab）
  const renderPseudotimeForm = () => {
    const pseudotimeSubItems = [
      {
        key: 'basic',
        label: '基础拟时分析',
        children: renderBasicPseudotimeForm(),
      },
      {
        key: 'custom',
        label: '个性化拟时分析',
        children: renderCustomPseudotimeForm(),
      },
    ];

    return (
      <Tabs
        activeKey={pseudotimeSubTab}
        onChange={(key) => {
          setPseudotimeSubTab(key);
          form.resetFields();
        }}
        items={pseudotimeSubItems}
        className={styles.subTabs}
      />
    );
  };

  // 表单按钮
  const renderFormButtons = () => (
    <Form.Item>
      <Space>
        <Button type="primary" htmlType="submit" loading={loading}>
          确认并创建
        </Button>
        <Button onClick={handleReset}>
          重置
        </Button>
      </Space>
    </Form.Item>
  );

  // 细胞通讯任务表单
  const renderCellCommunicationForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="目标细胞集"
        name="targetCellSet"
        rules={[{ required: true, message: '请选择目标细胞集' }]}
        tooltip="选择用于分析的细胞数据集"
      >
        <Select placeholder="请选择">
          <Option value="cellset1">细胞集1</Option>
          <Option value="cellset2">细胞集2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="分组方案"
        name="groupScheme"
        rules={[{ required: true, message: '请选择分组方案' }]}
        tooltip="选择实验分组方式"
      >
        <Select placeholder="请选择">
          <Option value="control_vs_treatment">对照 vs 处理</Option>
          <Option value="time_series">时间序列</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="软件选择"
        name="software"
        initialValue="cellchat"
        tooltip="选择细胞通讯分析工具"
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="cellchat">CellChat</Radio>
            <Radio value="cellphonedb">CellphoneDB</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="分析项目"
        name="analysisProjects"
      >
        <Checkbox.Group>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox value="interaction">细胞互作分析</Checkbox>
            <Checkbox value="ligand_receptor">配受体对分析</Checkbox>
            <Checkbox value="gene_set">基因集水平互作</Checkbox>
            <Checkbox value="group_diff" disabled>
              组间差异比较（需分组方案≥2）
            </Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="任务编号"
        name="taskNumber"
        rules={[{ required: true, message: '请输入任务编号' }]}
      >
        <Input placeholder="请输入内容" />
      </Form.Item>

      {renderFormButtons()}
    </Form>
  );

  // 转录因子任务表单
  const renderTranscriptionFactorForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="目标细胞集"
        name="targetCellSet"
        rules={[{ required: true, message: '请选择目标细胞集' }]}
        tooltip="选择用于分析的细胞数据集"
      >
        <Select placeholder="请选择">
          <Option value="cellset1">细胞集1</Option>
          <Option value="cellset2">细胞集2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="分组方案"
        name="groupScheme"
        rules={[{ required: true, message: '请选择分组方案' }]}
        tooltip="选择实验分组方式"
      >
        <Select placeholder="请选择">
          <Option value="control_vs_treatment">对照 vs 处理</Option>
          <Option value="time_series">时间序列</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="基因在细胞中表达的最小细胞数比例小于"
        name="minCellRatio"
        initialValue="25"
      >
        <Radio.Group>
          <Space direction="vertical">
            <Radio value="25">25%</Radio>
            <Radio value="30">30%</Radio>
            <Radio value="35">35%</Radio>
            <Radio value="custom">自定义</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="分析项目"
        name="analysisProjects"
      >
        <Checkbox.Group>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox value="tf_gene_stats">TF-gene统计</Checkbox>
            <Checkbox value="regulons_activity">Regulons活性降维</Checkbox>
            <Checkbox value="regulons_feature">Regulons活性特征</Checkbox>
            <Checkbox value="regulons_expression">Regulons表达量特征</Checkbox>
            <Checkbox value="tf_network">TF-gene互作网络</Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="任务编号"
        name="taskNumber"
        rules={[{ required: true, message: '请输入任务编号' }]}
      >
        <Input placeholder="请输入内容" />
      </Form.Item>

      {renderFormButtons()}
    </Form>
  );

  // 组间差异任务表单
  const renderGroupDiffForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="目标细胞集"
        name="targetCellSet"
        rules={[{ required: true, message: '请选择目标细胞集' }]}
        tooltip="选择用于分析的细胞数据集"
      >
        <Select placeholder="请选择">
          <Option value="cellset1">细胞集1</Option>
          <Option value="cellset2">细胞集2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="分组方案"
        name="groupScheme"
        rules={[{ required: true, message: '请选择分组方案' }]}
        tooltip="选择实验分组方式"
      >
        <Select placeholder="请选择">
          <Option value="control_vs_treatment">对照 vs 处理</Option>
          <Option value="time_series">时间序列</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="批次效应"
        name="batchEffect"
        initialValue="harmony"
      >
        <Select>
          <Option value="harmony">harmony</Option>
          <Option value="combat">ComBat</Option>
          <Option value="none">不校正</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="聚类基因集"
        name="clusterGeneSet"
      >
        <Select placeholder="请选择">
          <Option value="hvg">高变基因</Option>
          <Option value="custom">自定义基因集</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <div style={{ color: '#666', fontSize: '13px' }}>
          预估分析时间：30分钟~2天
        </div>
      </Form.Item>

      <Form.Item
        label="差异阈值"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Form.Item name="pseudoValue" label="伪值" initialValue={0.0001} noStyle>
              <InputNumber min={0} step={0.0001} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="log2FC" label="log2FC" initialValue={0.36} noStyle>
              <InputNumber min={0} step={0.01} style={{ width: 120 }} />
            </Form.Item>
          </Space>
          <Space>
            <Form.Item name="pValue" label="P值" initialValue={0.05} noStyle>
              <InputNumber min={0} max={1} step={0.01} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="minPct" label="min.pct" initialValue={0.1} noStyle>
              <InputNumber min={0} max={1} step={0.01} style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </Space>
      </Form.Item>

      <Form.Item
        label="下游分析项目"
        name="downstreamAnalysis"
      >
        <Checkbox.Group>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox value="deg_stats">差异基因统计</Checkbox>
            <Checkbox value="deg_distribution">差异基因分布</Checkbox>
            <Checkbox value="go_enrichment">差异基因GO富集</Checkbox>
            <Checkbox value="kegg_enrichment">差异基因KEGG富集</Checkbox>
            <Checkbox value="gsea">GSEA分析</Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="任务编号"
        name="taskNumber"
        rules={[{ required: true, message: '请输入任务编号' }]}
      >
        <Input placeholder="请输入内容" />
      </Form.Item>

      {renderFormButtons()}
    </Form>
  );

  // 细胞集上调基因分析表单
  const renderUpregulatedGeneForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
      initialValues={{
        batchEffect: 'harmony',
        resolution: 0.5,
        reDimension: 'yes'
      }}
    >
      {/* 基础配置区 */}
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item
            label="分组方案"
            name="groupScheme"
            rules={[{ required: true, message: '请选择分组方案' }]}
          >
            <Select placeholder="请选择分组方案（如对照 vs 处理）">
              <Option value="control_vs_treatment">对照 vs 处理</Option>
              <Option value="time_series">时间序列</Option>
              <Option value="custom">自定义分组</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="目标细胞集"
            name="targetCellSet"
            rules={[{ required: true, message: '请选择目标细胞集' }]}
          >
            <Select placeholder="请选择用于分析的细胞数据集">
              <Option value="cellset1">细胞集1</Option>
              <Option value="cellset2">细胞集2</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="重新降维"
            name="reDimension"
          >
            <Select>
              <Option value="yes">是</Option>
              <Option value="no">否</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="批次效应"
            name="batchEffect"
          >
            <Select>
              <Option value="harmony">Harmony</Option>
              <Option value="combat">ComBat</Option>
              <Option value="none">不校正</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* 嵌套参数分析区 */}
      <div className={styles.analysisSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>分析项目</span>
          <span className={styles.estimatedTime}>预估分析时间：30分钟~2天</span>
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* 细胞亚群分类分析 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.subgroupChecked !== currentValues.subgroupChecked
            }
          >
            {({ getFieldValue }) => {
              const subgroupChecked = getFieldValue('subgroupChecked');
              return (
                <div className={styles.analysisItem}>
                  <Row align="middle" gutter={16}>
                    <Col>
                      <Form.Item name="subgroupChecked" valuePropName="checked" noStyle>
                        <Checkbox>细胞亚群分类分析</Checkbox>
                      </Form.Item>
                    </Col>
                    {subgroupChecked && (
                      <Col flex="auto">
                        <Row gutter={12} align="middle">
                          <Col>
                            <span className={styles.paramLabel}>分辨率</span>
                          </Col>
                          <Col>
                            <Form.Item name="resolution" noStyle>
                              <InputNumber size="small" min={0.1} max={2} step={0.1} style={{ width: 80 }} />
                            </Form.Item>
                          </Col>
                          <Col>
                            <span className={styles.paramLabel}>聚类基因集</span>
                          </Col>
                          <Col>
                            <Form.Item name="clusterGeneSet" noStyle>
                              <Select size="small" style={{ width: 120 }} placeholder="请选择">
                                <Option value="hvg">高变基因</Option>
                                <Option value="custom">自定义基因集</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col>
                            <span className={styles.paramLabel}>聚类算法</span>
                          </Col>
                          <Col>
                            <Form.Item name="clusterAlgorithm" noStyle>
                              <Select size="small" style={{ width: 120 }} placeholder="请选择">
                                <Option value="louvain">Louvain</Option>
                                <Option value="leiden">Leiden</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                </div>
              );
            }}
          </Form.Item>

          {/* 亚群marker基因分析 */}
          <Form.Item name="markerChecked" valuePropName="checked" noStyle>
            <Checkbox>亚群marker基因分析</Checkbox>
          </Form.Item>

          {/* 亚群上调基因分析 */}
          <Form.Item name="upregulatedChecked" valuePropName="checked" noStyle>
            <Checkbox>亚群上调基因分析</Checkbox>
          </Form.Item>

          {/* 细胞频率差异 */}
          <Form.Item name="frequencyChecked" valuePropName="checked" noStyle>
            <Checkbox>细胞频率差异</Checkbox>
          </Form.Item>
        </Space>
      </div>

      {/* 底部提交栏 */}
      <div className={styles.submitSection}>
        <Space size="middle" align="center">
          <span className={styles.paramLabel}>任务编号</span>
          <Form.Item 
            name="taskNumber" 
            rules={[{ required: true, message: '请输入任务编号' }]}
            noStyle
          >
            <Input placeholder="请输入任务编号" style={{ width: 200 }} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认并创建
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>
    </Form>
  );

  // 基因集打分分析表单（包含子Tab）
  const renderGeneScoringForm = () => {
    const basicScoringForm = (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          label="细胞集"
          name="cellSet"
          rules={[{ required: true, message: '请选择细胞集' }]}
          tooltip="选择用于分析的细胞数据集"
        >
          <Select placeholder="请选择">
            <Option value="cellset1">细胞集1</Option>
            <Option value="cellset2">细胞集2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="分组方案"
          name="groupScheme"
          rules={[{ required: true, message: '请选择分组方案' }]}
          tooltip="选择实验分组方式"
        >
          <Select placeholder="请选择">
            <Option value="control_vs_treatment">对照 vs 处理</Option>
            <Option value="time_series">时间序列</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="基因集选择"
          name="geneSetSelection"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox value="target">目标基因集</Checkbox>
            <Checkbox value="upload">文件上传</Checkbox>
          </Space>
        </Form.Item>

        <Form.Item
          label="软件选择"
          name="software"
        >
          <Checkbox.Group>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox value="mean">mean</Checkbox>
              <Checkbox value="seurat">seurat</Checkbox>
              <Checkbox value="aucell">AUCell</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Top基因比例(AUCell)"
          name="topGeneRatio"
          initialValue={0.05}
        >
          <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="基因集相关性阈值选择"
          name="correlationThreshold"
          initialValue="q3q4"
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="q3q4">第三四分位数</Radio>
              <Radio value="median">中位数</Radio>
              <Radio value="custom">自定义</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="分析项目"
          name="analysisProjects"
        >
          <Checkbox.Group>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox value="classification">基因集分类</Checkbox>
              <Checkbox value="positive_cell">阳性细胞分析</Checkbox>
              <Checkbox value="assessment">基因集得分评估</Checkbox>
              <Checkbox value="distribution">基因表达分布</Checkbox>
              <Checkbox value="score_diff">打分差异</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="新任务编号"
          name="newTaskNumber"
          rules={[{ required: true, message: '请输入新任务编号' }]}
        >
          <Input placeholder="请输入内容" />
        </Form.Item>

        {renderFormButtons()}
      </Form>
    );

    const diffScoringForm = (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          label="任务编号"
          name="taskNumber"
          rules={[{ required: true, message: '请选择任务编号' }]}
        >
          <Select placeholder="请选择">
            <Option value="task1">任务1</Option>
            <Option value="task2">任务2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="分组方案"
          name="groupScheme"
          rules={[{ required: true, message: '请选择分组方案' }]}
        >
          <Select placeholder="请选择">
            <Option value="control_vs_treatment">对照 vs 处理</Option>
            <Option value="time_series">时间序列</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="基因集选择"
          name="geneSet"
        >
          <Select placeholder="请选择">
            <Option value="geneset1">基因集1</Option>
            <Option value="geneset2">基因集2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="软件选择"
          name="software"
        >
          <Checkbox.Group>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox value="mean">mean</Checkbox>
              <Checkbox value="seurat">seurat</Checkbox>
              <Checkbox value="aucell">AUCell</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="新任务编号"
          name="newTaskNumber"
          rules={[{ required: true, message: '请输入新任务编号' }]}
        >
          <Input placeholder="请输入内容" />
        </Form.Item>

        {renderFormButtons()}
      </Form>
    );

    const scoringSubItems = [
      {
        key: 'basic',
        label: '基础基因集打分分析',
        children: basicScoringForm,
      },
      {
        key: 'diff',
        label: '基因集打分差异分析',
        children: diffScoringForm,
      },
    ];

    return (
      <Tabs
        activeKey={scoringSubTab}
        onChange={(key) => {
          setScoringSubTab(key);
          form.resetFields();
        }}
        items={scoringSubItems}
        className={styles.subTabs}
      />
    );
  };

  // 目标基因任务表单
  const renderTargetGeneForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="任务编号"
        name="taskNumber"
        rules={[{ required: true, message: '请选择任务编号' }]}
      >
        <Select placeholder="请选择">
          <Option value="task1">任务1</Option>
          <Option value="task2">任务2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="目标基因集"
        name="targetGeneSet"
        rules={[{ required: true, message: '请选择目标基因集' }]}
      >
        <Select placeholder="请选择">
          <Option value="geneset1">基因集1</Option>
          <Option value="geneset2">基因集2</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <div style={{ color: '#666', fontSize: '13px' }}>
          预估分析时间：30分钟~2天
        </div>
      </Form.Item>

      <Form.Item
        label="韦恩图分析"
        name="vennAnalysis"
        valuePropName="checked"
      >
        <Checkbox>韦恩图分析（需选择两个及以上基因集；组间差异分析暂不支持）</Checkbox>
      </Form.Item>

      <Form.Item
        label="富集分析"
        name="enrichmentAnalysis"
        valuePropName="checked"
      >
        <Checkbox>富集分析</Checkbox>
      </Form.Item>

      <Form.Item
        label="数据库分析"
        name="databaseAnalysis"
      >
        <Checkbox.Group>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox value="tcga">
              TCGA分析
              <span style={{ color: '#ff4d4f', marginLeft: 8, fontSize: '12px' }}>
                （目标基因集数目需要小于30个）
              </span>
            </Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="癌症类型（多选）"
        name="cancerTypes"
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <Checkbox value="pan">泛癌（Pan Cancer）</Checkbox>
            <Checkbox value="paad">胰腺癌（PAAD）</Checkbox>
            <Checkbox value="luad">肺腺癌（LUAD）</Checkbox>
            <Checkbox value="brca">乳腺癌（BRCA）</Checkbox>
            <Checkbox value="coad">结肠癌（COAD）</Checkbox>
            <Checkbox value="stad">胃癌（STAD）</Checkbox>
            <Checkbox value="lihc">肝癌（LIHC）</Checkbox>
            <Checkbox value="ucec">子宫内膜癌（UCEC）</Checkbox>
          </div>
        </Checkbox.Group>
      </Form.Item>

      <Form.Item
        label="任务编号"
        name="finalTaskNumber"
        rules={[{ required: true, message: '请输入任务编号' }]}
      >
        <Input placeholder="请输入内容" />
      </Form.Item>

      {renderFormButtons()}
    </Form>
  );

  // Tab配置
  const tabItems = [
    {
      key: 'process',
      label: '流程',
      children: renderProcessForm(),
    },
    {
      key: 'recluster',
      label: '再分群分析',
      children: renderReClusterForm(),
    },
    {
      key: 'cellAnnotation',
      label: '细胞注释',
      children: renderCellAnnotationForm(),
    },
    {
      key: 'pseudotime',
      label: '拟时分析',
      children: renderPseudotimeForm(),
    },
    {
      key: 'cellCommunication',
      label: '细胞通讯',
      children: renderCellCommunicationForm(),
    },
    {
      key: 'transcriptionFactor',
      label: '转录因子',
      children: renderTranscriptionFactorForm(),
    },
    {
      key: 'groupDiff',
      label: '组间差异',
      children: renderGroupDiffForm(),
    },
    {
      key: 'upregulatedGene',
      label: '细胞集上调基因分析',
      children: renderUpregulatedGeneForm(),
    },
    {
      key: 'geneScoring',
      label: '基因集打分',
      children: renderGeneScoringForm(),
    },
    {
      key: 'targetGene',
      label: '目标基因',
      children: renderTargetGeneForm(),
    },
  ];

  return (
    <PageTemplate 
      pageTitle="新建任务"
      showButtons={false}
    >
      <div className={styles.container}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className={styles.tabs}
        />
      </div>
    </PageTemplate>
  );
};

export default CreateTask;