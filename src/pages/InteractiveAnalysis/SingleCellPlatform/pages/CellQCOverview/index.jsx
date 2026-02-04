import { useState, useMemo } from 'react';
import PageTemplate from '../../components/PageTemplate';
import ResultPageTemplate from '../../components/ResultPageTemplate';
import { ViolinChart } from '../../components/D3Charts';
import {
  Tabs, 
  Select, 
  Button, 
  Space,
  message,
  Modal,
  List,
  Input
} from 'antd';
import { 
  SwapOutlined,
  EditOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons';
import cellQCData from './data.json';

const { Option } = Select;

// 细胞质控总览
const CellQCOverview = () => {
  // Tab相关状态
  const [activeTab, setActiveTab] = useState('violin');

  // 参数切换展开状态
  const [parameterExpanded, setParameterExpanded] = useState(false);

  // 指标选择状态
  const [groupSampleType, setGroupSampleType] = useState('group'); // 分组/样本
  const [metricType, setMetricType] = useState('genes'); // 有效基因/有效转录本(UMI)/线粒体

  // 样本名称和顺序
  const [sampleModalVisible, setSampleModalVisible] = useState(false);
  const [sampleList, setSampleList] = useState([
    { id: 1, name: 'PRE', displayName: 'PRE' },
    { id: 2, name: 'POST', displayName: 'POST' }
  ]);
  const [editingSampleList, setEditingSampleList] = useState([]);

  // 初始化表格数据 - 汇总统计数据
  const tableData = useMemo(() => {
    return Object.keys(cellQCData).map((sampleName, index) => {
      const values = cellQCData[sampleName].values;
      const cells = values.length;
      const totalUMI = values.reduce((sum, val) => sum + val, 0);
      const umiPerCell = totalUMI / cells;
      
      // 计算线粒体比例（这里假设数据就是线粒体比例）
      const avgMitoPercent = (values.reduce((sum, val) => sum + val, 0) / cells) * 100;
      
      // 计算样本比例（假设数据中的值代表某种比例）
      const samplePercent = (values.reduce((sum, val) => sum + val, 0) / cells) * 100;
      
      return {
        key: String(index + 1),
        sample: sampleName,
        cells: cells,
        umi: Math.round(totalUMI),
        umiPerCell: umiPerCell.toFixed(2),
        mitoPercent: avgMitoPercent.toFixed(2) + '%',
        samplePercent: samplePercent.toFixed(1) + '%',
      };
    });
  }, []);

  // 表格选中状态，默认全选
  const [selectedRowKeys, setSelectedRowKeys] = useState(() => 
    tableData.map(item => item.key)
  );

  // 根据选中的行筛选数据传给图表
  const selectedSamplesData = useMemo(() => {
    // 获取选中行对应的样本名称
    const selectedSamples = tableData
      .filter(item => selectedRowKeys.includes(item.key))
      .map(item => item.sample);
    
    // 构建 D3Charts ViolinChart 需要的数据格式
    // 格式: [{ name: 'PRE', values: [...] }, { name: 'POST', values: [...] }]
    const chartData = selectedSamples.map(sampleName => ({
      name: sampleName,
      values: cellQCData[sampleName]?.values || []
    }));
    
    // 调试输出
    console.log('传递给图表的数据:', chartData);
    console.log('数据点数量:', chartData.map(d => ({ name: d.name, count: d.values.length })));
    console.log('数据范围:', chartData.map(d => ({ 
      name: d.name, 
      min: Math.min(...d.values), 
      max: Math.max(...d.values) 
    })));
    
    return chartData;
  }, [selectedRowKeys, tableData]);

  // 表格列定义
  const columns = useMemo(() => {
    return [
      {
        title: 'sample',
        dataIndex: 'sample',
        key: 'sample',
        width: 150,
        fixed: 'left',
      },
      {
        title: 'cells',
        dataIndex: 'cells',
        key: 'cells',
        width: 120,
        sorter: (a, b) => a.cells - b.cells,
      },
      {
        title: 'UMI',
        dataIndex: 'umi',
        key: 'umi',
        width: 150,
        sorter: (a, b) => a.umi - b.umi,
      },
      {
        title: 'UMI/cells',
        dataIndex: 'umiPerCell',
        key: 'umiPerCell',
        width: 150,
        sorter: (a, b) => parseFloat(a.umiPerCell) - parseFloat(b.umiPerCell),
      },
      {
        title: '线粒体UMI比例',
        dataIndex: 'mitoPercent',
        key: 'mitoPercent',
        width: 150,
        sorter: (a, b) => parseFloat(a.mitoPercent) - parseFloat(b.mitoPercent),
      },
      {
        title: '样本细胞比例',
        dataIndex: 'samplePercent',
        key: 'samplePercent',
        width: 150,
        sorter: (a, b) => parseFloat(a.samplePercent) - parseFloat(b.samplePercent),
      },
    ];
  }, []);

  // 下载处理
  const handleDownload = (selectedKeys) => {
    const selectedData = tableData.filter(item => selectedKeys.includes(item.key));
    console.log('下载数据:', selectedData);
    message.success(`正在下载 ${selectedData.length} 条数据`);
  };

  // 刷新处理
  const handleRefresh = () => {
    message.success('数据已刷新');
    // 重新全选
    setSelectedRowKeys(tableData.map(item => item.key));
  };

  // Tab项配置
  const tabItems = [
    {
      key: 'violin',
      label: '小提琴图',
    },
  ];

  // 图表内容
  const chartContent = (
    <div>
      {/* 参数切换和修改样本按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button 
            icon={<SwapOutlined />}
            onClick={() => setParameterExpanded(!parameterExpanded)}
          >
            参数切换
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSampleList([...sampleList]);
              setSampleModalVisible(true);
            }}
          >
            修改样本名称和顺序
          </Button>
        </Space>
      </div>

      {/* 参数切换折叠面板 */}
      {parameterExpanded && (
        <div style={{ 
          marginBottom: 16, 
          padding: 16, 
          background: '#fafafa', 
          borderRadius: 4,
          border: '1px solid #d9d9d9'
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>指标选择：</span>
            <Select
              value={groupSampleType}
              onChange={setGroupSampleType}
              style={{ width: 150 }}
            >
              <Option value="group">分组</Option>
              <Option value="sample">样本</Option>
            </Select>
            <Select
              value={metricType}
              onChange={setMetricType}
              style={{ width: 200 }}
            >
              <Option value="genes">有效基因</Option>
              <Option value="umi">有效转录本（UMI）</Option>
              <Option value="mitochondria">线粒体</Option>
            </Select>
          </div>
        </div>
      )}


      {/* 小提琴图 */}
      {selectedSamplesData.length > 0 ? (
        <ViolinChart 
          data={selectedSamplesData}
          height={500}
        />
      ) : (
        <div style={{ 
          padding: 60, 
          textAlign: 'center', 
          color: '#999',
          background: '#fafafa',
          borderRadius: 4,
          border: '1px dashed #d9d9d9'
        }}>
          请在下方表格中选择至少一个样本以显示图表
        </div>
      )}
    </div>
  );

  return (
    <PageTemplate pageTitle="细胞质控总览">
      {/* Tab标签栏 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />
      <div style={{ padding: '16px', background: '#fff' }}>
        <ResultPageTemplate
          chartContent={chartContent}
          tableColumns={columns}
          tableData={tableData}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={setSelectedRowKeys}
          onDownload={handleDownload}
          onRefresh={handleRefresh}
        />

        {/* 修改样本名称和顺序模态框 */}
        <Modal
          title="修改样本名称和顺序"
          open={sampleModalVisible}
          onCancel={() => setSampleModalVisible(false)}
          onOk={() => {
            setSampleList([...editingSampleList]);
            setSampleModalVisible(false);
            message.success('样本名称和顺序已更新');
          }}
          width={500}
        >
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: '#666', marginBottom: 8 }}>
              可以修改样本的显示名称，并通过上下箭头调整顺序
            </p>
          </div>
          <List
            dataSource={editingSampleList}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                style={{ 
                  padding: '12px 16px',
                  background: '#fafafa',
                  marginBottom: 8,
                  borderRadius: 4
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 12 }}>
                  <span style={{ minWidth: 80, fontWeight: 500 }}>
                    原名称: {item.name}
                  </span>
                  <Input
                    value={item.displayName}
                    onChange={(e) => {
                      const newList = [...editingSampleList];
                      newList[index].displayName = e.target.value;
                      setEditingSampleList(newList);
                    }}
                    placeholder="显示名称"
                    style={{ flex: 1 }}
                  />
                  <Space>
                    <Button
                      size="small"
                      icon={<UpOutlined />}
                      disabled={index === 0}
                      onClick={() => {
                        if (index > 0) {
                          const newList = [...editingSampleList];
                          [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
                          setEditingSampleList(newList);
                        }
                      }}
                    />
                    <Button
                      size="small"
                      icon={<DownOutlined />}
                      disabled={index === editingSampleList.length - 1}
                      onClick={() => {
                        if (index < editingSampleList.length - 1) {
                          const newList = [...editingSampleList];
                          [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
                          setEditingSampleList(newList);
                        }
                      }}
                    />
                  </Space>
                </div>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </PageTemplate>
  );
};

export default CellQCOverview;