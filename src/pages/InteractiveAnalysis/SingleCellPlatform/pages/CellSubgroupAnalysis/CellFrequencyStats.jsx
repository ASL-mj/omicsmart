import { useState, useMemo } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import { StackedChart, RiverChart } from '../../components/D3Charts';
import stackedData from './data/CellFrequrncyStats/1.json';
import riverData from './data/CellFrequrncyStats/2.json';

// 细胞亚群分类分析
const CellFrequencyStats = () => {
  const [activeTab, setActiveTab] = useState('stacked');

  // 堆叠图表格数据
  const stackedTableData = useMemo(() => {
    if (!stackedData || !stackedData.columns || !stackedData.data) return [];
    
    const columns = stackedData.columns;
    const data = stackedData.data[0];
    
    return columns.map((col, idx) => ({
      key: String(idx + 1),
      cluster: String(col),
      pre: data[0][idx],
      post: data[1][idx],
      diff: data[1][idx] - data[0][idx],
      ratio: data[0][idx] !== 0 
        ? ((data[1][idx] - data[0][idx]) / data[0][idx] * 100).toFixed(2) + '%'
        : 'N/A'
    }));
  }, []);

  // 河流图表格数据
  const riverTableData = useMemo(() => {
    if (!riverData || !riverData.result) return [];
    
    const { columns, data } = riverData.result;
    const dataArray = data[0];
    
    return columns.map((col, idx) => ({
      key: String(idx + 1),
      cluster: String(col),
      pre: dataArray[0][idx],
      post: dataArray[1][idx],
      total: dataArray[0][idx] + dataArray[1][idx],
    }));
  }, []);

  // 选中的行 - 使用 useState 的函数形式初始化
  const [selectedStackedRows, setSelectedStackedRows] = useState(() => 
    stackedTableData.map(item => item.key)
  );
  const [selectedRiverRows, setSelectedRiverRows] = useState(() => 
    riverTableData.map(item => item.key)
  );

  // 处理堆叠图数据 - 将数据转换为 StackedChart 需要的格式，根据选中的行过滤
  const processedStackedData = useMemo(() => {
    if (!stackedData || !stackedData.columns || !stackedData.data) return [];
    
    const columns = stackedData.columns;
    const data = stackedData.data[0]; // data[0] 包含两个数组，分别是两个样本的数据
    
    // 根据选中的行过滤数据
    const selectedIndices = selectedStackedRows.map(key => parseInt(key) - 1);
    
    // 转换为StackedChart需要的格式
    // 横坐标是各个亚群，图例是PRE和POST
    const result = selectedIndices.map(idx => ({
      category: String(columns[idx]), // 横坐标：亚群名称
      values: {
        'PRE': data[0][idx],   // 图例：PRE
        'POST': data[1][idx]   // 图例：POST
      }
    }));
    
    return result;
  }, [selectedStackedRows]);

  // 处理河流图数据 - 转换为面积图格式，根据选中的行过滤
  const processedRiverData = useMemo(() => {
    if (!riverData || !riverData.result) return [];
    
    const { columns, data, rownames } = riverData.result;
    const dataArray = data[0];
    
    // 根据选中的行过滤数据
    const selectedIndices = selectedRiverRows.map(key => parseInt(key) - 1);
    const selectedColumns = selectedIndices.map(idx => columns[idx]);
    
    // 转换为StackedChart需要的格式
    // 横坐标是PRE和POST，图例是各个亚群
    const result = [];
    
    // PRE 时间点
    const preValues = {};
    selectedIndices.forEach((idx, i) => {
      preValues[String(selectedColumns[i])] = dataArray[0][idx];
    });
    result.push({
      category: rownames[0], // PRE
      values: preValues
    });
    
    // POST 时间点
    const postValues = {};
    selectedIndices.forEach((idx, i) => {
      postValues[String(selectedColumns[i])] = dataArray[1][idx];
    });
    result.push({
      category: rownames[1], // POST
      values: postValues
    });
    
    return result;
  }, [selectedRiverRows]);

  const stackedTableColumns = [
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: 'PRE细胞数', dataIndex: 'pre', key: 'pre', sorter: (a, b) => a.pre - b.pre },
    { title: 'POST细胞数', dataIndex: 'post', key: 'post', sorter: (a, b) => a.post - b.post },
    { title: '差异值', dataIndex: 'diff', key: 'diff', sorter: (a, b) => a.diff - b.diff },
    { title: '变化率', dataIndex: 'ratio', key: 'ratio' },
  ];

  const riverTableColumns = [
    { title: 'Cluster', dataIndex: 'cluster', key: 'cluster' },
    { title: 'PRE', dataIndex: 'pre', key: 'pre', sorter: (a, b) => a.pre - b.pre },
    { title: 'POST', dataIndex: 'post', key: 'post', sorter: (a, b) => a.post - b.post },
    { title: 'total', dataIndex: 'total', key: 'total', sorter: (a, b) => a.total - b.total },
  ];

  // 下载处理
  const handleStackedDownload = (selectedRowKeys) => {
    message.success(`正在下载堆叠图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleRiverDownload = (selectedRowKeys) => {
    message.success(`正在下载河流图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleStackedRefresh = () => {
    message.success('已刷新堆叠图数据');
    setSelectedStackedRows(stackedTableData.map(item => item.key));
  };

  const handleRiverRefresh = () => {
    message.success('已刷新河流图数据');
    setSelectedRiverRows(riverTableData.map(item => item.key));
  };

  const tabItems = [
    {
      key: 'stacked',
      label: '堆叠图',
    },
    {
      key: 'river',
      label: '河流图',
    }
  ];

  return (
    <PageTemplate pageTitle="细胞频率统计">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'stacked' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div style={{ width: '100%', minHeight: '500px' }}>
              <StackedChart 
                data={processedStackedData}
                height={500}
              />
            </div>
          }
          tableColumns={stackedTableColumns}
          tableData={stackedTableData}
          selectedRowKeys={selectedStackedRows}
          onSelectChange={setSelectedStackedRows}
          onDownload={handleStackedDownload}
          onRefresh={handleStackedRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'river' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div style={{ width: '100%', minHeight: '500px' }}>
              <RiverChart 
                data={processedRiverData}
                height={500}
              />
            </div>
          }
          tableColumns={riverTableColumns}
          tableData={riverTableData}
          selectedRowKeys={selectedRiverRows}
          onSelectChange={setSelectedRiverRows}
          onDownload={handleRiverDownload}
          onRefresh={handleRiverRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default CellFrequencyStats;