import { useMemo,useState } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import { Tabs, Table } from 'antd';
import { ScatterChart, GradientScatterChart } from '../../components/D3Charts';
import data1 from './data/ClassificationTSNE/1.json';
import data2 from './data/ClassificationTSNE/2.json';
import data3 from './data/ClassificationTSNE/3.json';

const ClassificationTSNE = () => {
  const [activeTab, setActiveTab] = useState('subgroup');

  // 处理数据1 - 亚群信息（按Cluster分组）
  // list格式: [x, y, cluster编号, sample]
  const processedData1 = useMemo(() => {
    if (!data1 || !data1.list || !data1.cluster) return [];
    
    // 按cluster分组数据
    const groupedData = {};
    data1.list.forEach(item => {
      const [x, y, clusterOld] = item;
      // 通过cluster字典找到对应的图例名称
      const clusterInfo = data1.cluster.find(c => c.old === String(clusterOld));
      const clusterName = clusterInfo ? clusterInfo.new : String(clusterOld);
      
      if (!groupedData[clusterName]) {
        groupedData[clusterName] = [];
      }
      groupedData[clusterName].push({
        x: parseFloat(x),
        y: parseFloat(y)
      });
    });
    
    // 转换为ScatterChart需要的格式
    return Object.keys(groupedData).map(clusterName => ({
      name: clusterName,
      data: groupedData[clusterName]
    }));
  }, []);

  // 处理数据2 - 样本信息（按Sample分组）
  // list格式: [x, y, cluster名称, sample]
  const processedData2 = useMemo(() => {
    if (!data2 || !data2.list || !data2.sample) return [];
    
    // 按sample分组数据
    const groupedData = {};
    data2.list.forEach(item => {
      const [x, y, , sampleOld] = item;
      // 通过sample字典找到对应的图例名称
      const sampleInfo = data2.sample.find(s => s.old === sampleOld);
      const sampleName = sampleInfo ? sampleInfo.new : sampleOld;
      
      if (!groupedData[sampleName]) {
        groupedData[sampleName] = [];
      }
      groupedData[sampleName].push({
        x: parseFloat(x),
        y: parseFloat(y)
      });
    });
    
    // 转换为ScatterChart需要的格式
    return Object.keys(groupedData).map(sampleName => ({
      name: sampleName,
      data: groupedData[sampleName]
    }));
  }, []);

  // 处理数据3 - UMI信息（渐变色显示）
  // 从 data_list 中提取坐标和 nUMI 值
  const processedData3 = useMemo(() => {
    if (!data3 || !data3.data_list) return [];
    
    return data3.data_list.map(item => ({
      x: parseFloat(item.tSNE_1),
      y: parseFloat(item.tSNE_2),
      nUMI: parseInt(item.nUMI),
      cell: item.cell,
      nGene: item.nGene,
      Sample: item.Sample,
      Cluster: item.Cluster,
      Group: item.Group,
    }));
  }, []);

  // 表格数据1 - 从data_list生成
  const tableData1 = useMemo(() => {
    if (!data1 || !data1.data_list) return [];
    
    return data1.data_list.map((item, idx) => {
      const row = {
        key: String(idx + 1),
        GeneID: item.GeneID,
        GeneName: item.GeneName,
      };
      
      // 添加所有Cluster列
      Object.keys(item).forEach(key => {
        if (key.startsWith('Cluster ')) {
          row[key] = item[key];
        }
      });
      
      return row;
    });
  }, []);

  // 表格列1
  const tableColumns1 = useMemo(() => {
    if (!data1 || !data1.data_list || data1.data_list.length === 0) return [];
    
    const columns = [
      { title: 'GeneID', dataIndex: 'GeneID', key: 'GeneID', width: 150, fixed: 'left' },
      { title: 'GeneName', dataIndex: 'GeneName', key: 'GeneName', width: 150, fixed: 'left' },
    ];
    
    // 动态添加Cluster列
    const firstItem = data1.data_list[0];
    Object.keys(firstItem).forEach(key => {
      if (key.startsWith('Cluster ')) {
        columns.push({
          title: key,
          dataIndex: key,
          key: key,
          width: 100,
          sorter: (a, b) => parseFloat(a[key]) - parseFloat(b[key])
        });
      }
    });
    
    return columns;
  }, []);

  // 表格数据2
  const tableData2 = useMemo(() => {
    if (!data2 || !data2.data_list) return [];
    
    return data2.data_list.map((item, idx) => ({
      key: String(idx + 1),
      GeneID: item.GeneID,
      GeneName: item.GeneName,
      ...Object.keys(item).reduce((acc, key) => {
        if (key.startsWith('Sample ')) {
          acc[key] = item[key];
        }
        return acc;
      }, {})
    }));
  }, []);

  // 表格列2
  const tableColumns2 = useMemo(() => {
    if (!data2 || !data2.data_list || data2.data_list.length === 0) return [];
    
    const columns = [
      { title: 'GeneID', dataIndex: 'GeneID', key: 'GeneID', width: 150, fixed: 'left' },
      { title: 'GeneName', dataIndex: 'GeneName', key: 'GeneName', width: 150, fixed: 'left' },
    ];
    
    // 动态添加Sample列
    const firstItem = data2.data_list[0];
    Object.keys(firstItem).forEach(key => {
      if (key.startsWith('Sample ')) {
        columns.push({
          title: key,
          dataIndex: key,
          key: key,
          width: 120,
          sorter: (a, b) => parseFloat(a[key]) - parseFloat(b[key])
        });
      }
    });
    
    return columns;
  }, []);

  // 表格数据3
  const tableData3 = useMemo(() => {
    if (!data3 || !data3.data_list) return [];
    
    return data3.data_list.map((item, idx) => ({
      key: String(idx + 1),
      cell: item.cell,
      tSNE_1: item.tSNE_1,
      tSNE_2: item.tSNE_2,
      nUMI: item.nUMI,
      nGene: item.nGene,
      Sample: item.Sample,
      Cluster: item.Cluster,
      Group: item.Group
    }));
  }, []);

  // 表格列3
  const tableColumns3 = [
    { title: 'cell', dataIndex: 'cell', key: 'cell', width: 180, fixed: 'left' },
    { title: 'tSNE_1', dataIndex: 'tSNE_1', key: 'tSNE_1', width: 100, sorter: (a, b) => parseFloat(a.tSNE_1) - parseFloat(b.tSNE_1) },
    { title: 'tSNE_2', dataIndex: 'tSNE_2', key: 'tSNE_2', width: 100, sorter: (a, b) => parseFloat(a.tSNE_2) - parseFloat(b.tSNE_2) },
    { title: 'nUMI', dataIndex: 'nUMI', key: 'nUMI', width: 100, sorter: (a, b) => parseInt(a.nUMI) - parseInt(b.nUMI) },
    { title: 'nGene', dataIndex: 'nGene', key: 'nGene', width: 100, sorter: (a, b) => parseInt(a.nGene) - parseInt(b.nGene) },
    { title: 'Sample', dataIndex: 'Sample', key: 'Sample', width: 120 },
    { title: 'Cluster', dataIndex: 'Cluster', key: 'Cluster', width: 100 },
    { title: 'Group', dataIndex: 'Group', key: 'Group', width: 100 },
  ];

  const tabItems = [
    {
      key: 'subgroup',
      label: '亚群信息',
    },
    {
      key: 'sample',
      label: '样本信息',
    },
    {
      key: 'umi',
      label: '转录本（UMI）信息',
    }
  ];

  return (
    <PageTemplate pageTitle="分类t-SNE图">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'subgroup' ? 'block' : 'none' }}>
        <div style={{ width: '100%', minHeight: '600px', marginBottom: 16 }}>
          <ScatterChart 
            data={processedData1}
            height={600}
          />
        </div>
        <Table
          columns={tableColumns1}
          dataSource={tableData1}
          scroll={{ x: 'max-content', y: 400 }}
          pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </div>

      <div style={{ display: activeTab === 'sample' ? 'block' : 'none' }}>
        <div style={{ width: '100%', minHeight: '600px', marginBottom: 16 }}>
          <ScatterChart 
            data={processedData2}
            height={600}
          />
        </div>
        <Table
          columns={tableColumns2}
          dataSource={tableData2}
          scroll={{ x: 'max-content', y: 400 }}
          pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </div>

      <div style={{ display: activeTab === 'umi' ? 'block' : 'none' }}>
        <div style={{ width: '100%', minHeight: '600px', marginBottom: 16 }}>
          <GradientScatterChart 
            data={processedData3}
            valueKey="nUMI"
            height={600}
          />
        </div>
        <Table
          columns={tableColumns3}
          dataSource={tableData3}
          scroll={{ x: 'max-content', y: 400 }}
          pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </div>
    </PageTemplate>
  );
};

export default ClassificationTSNE;