import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const Monocle3DimensionReduction = () => {
  const [activeTab, setActiveTab] = useState('partition');
  const partitionChartRef = useRef(null);
  const clusterChartRef = useRef(null);

  // 选中的行
  const [selectedPartitionRows, setSelectedPartitionRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedClusterRows, setSelectedClusterRows] = useState(['1', '2', '3', '4', '5']);

  // 分区信息图表数据
  const partitionTableData = [
    { key: '1', cell: 'Cell_001', x: 2.3, y: 1.8, partition: 'Partition_A', score: 0.23, cluster: 'Cluster_1' },
    { key: '2', cell: 'Cell_002', x: -1.2, y: 0.5, partition: 'Partition_B', score: 0.45, cluster: 'Cluster_2' },
    { key: '3', cell: 'Cell_003', x: 0.8, y: -2.1, partition: 'Partition_A', score: 0.67, cluster: 'Cluster_2' },
    { key: '4', cell: 'Cell_004', x: 1.5, y: 0.9, partition: 'Partition_C', score: 0.82, cluster: 'Cluster_3' },
    { key: '5', cell: 'Cell_005', x: -0.7, y: 1.6, partition: 'Partition_B', score: 0.35, cluster: 'Cluster_1' },
  ];

  const partitionTableColumns = [
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '分区', dataIndex: 'partition', key: 'partition' },
    { title: '分区得分', dataIndex: 'score', key: 'score', sorter: (a, b) => a.score - b.score },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
  ];

  // 亚群信息图表数据
  const clusterTableData = [
    { key: '1', cell: 'Cell_001', x: 2.3, y: 1.8, cluster: 'Epithelial', conf: 0.92, partition: 'Partition_A' },
    { key: '2', cell: 'Cell_002', x: -1.2, y: 0.5, cluster: 'Stromal', conf: 0.85, partition: 'Partition_B' },
    { key: '3', cell: 'Cell_003', x: 0.8, y: -2.1, cluster: 'Immune', conf: 0.78, partition: 'Partition_A' },
    { key: '4', cell: 'Cell_004', x: 1.5, y: 0.9, cluster: 'Epithelial', conf: 0.94, partition: 'Partition_C' },
    { key: '5', cell: 'Cell_005', x: -0.7, y: 1.6, cluster: 'Stromal', conf: 0.87, partition: 'Partition_B' },
  ];

  const clusterTableColumns = [
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '置信度', dataIndex: 'conf', key: 'conf', sorter: (a, b) => a.conf - b.conf },
    { title: '分区', dataIndex: 'partition', key: 'partition' },
  ];

  // 更新分区信息散点图 (D3)
  const updatePartitionChart = (selectedKeys) => {
    if (!partitionChartRef.current) return;

    // 清空之前的内容
    d3.select(partitionChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = partitionTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = partitionChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(partitionChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const xMin = d3.min(selectedData, d => d.x);
    const xMax = d3.max(selectedData, d => d.x);
    const yMin = d3.min(selectedData, d => d.y);
    const yMax = d3.max(selectedData, d => d.y);
    
    // X 轴比例尺
    const xScale = d3.scaleLinear()
      .domain([xMin - 0.5, xMax + 0.5])
      .range([0, width]);

    // Y 轴比例尺
    const yScale = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([height, 0]);

    // 分区颜色比例尺
    const partitions = [...new Set(selectedData.map(d => d.partition))];
    const colorScale = d3.scaleOrdinal()
      .domain(partitions)
      .range(d3.schemeCategory10.slice(0, partitions.length));

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.partition))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.x) + 10)
          .attr('y', yScale(d.y) - 50)
          .attr('width', 150)
          .attr('height', 80)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 40)
          .text(d.cell)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 25)
          .text(`分区: ${d.partition}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`分区得分: ${d.score}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 5)
          .text(`亚群: ${d.cluster}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 20)
          .text(`坐标: (${d.x}, ${d.y})`)
          .style('font-size', '12px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Y 轴标签
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Y坐标');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('X坐标');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('分区信息');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    partitions.forEach((partition, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(partition));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(partition);
    });
  };

  // 更新亚群信息散点图 (D3)
  const updateClusterChart = (selectedKeys) => {
    if (!clusterChartRef.current) return;

    // 清空之前的内容
    d3.select(clusterChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = clusterTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = clusterChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(clusterChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const xMin = d3.min(selectedData, d => d.x);
    const xMax = d3.max(selectedData, d => d.x);
    const yMin = d3.min(selectedData, d => d.y);
    const yMax = d3.max(selectedData, d => d.y);
    
    // X 轴比例尺
    const xScale = d3.scaleLinear()
      .domain([xMin - 0.5, xMax + 0.5])
      .range([0, width]);

    // Y 轴比例尺
    const yScale = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([height, 0]);

    // 亚群颜色比例尺
    const clusters = [...new Set(selectedData.map(d => d.cluster))];
    const colorScale = d3.scaleOrdinal()
      .domain(clusters)
      .range(d3.schemeCategory10.slice(0, clusters.length));

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.cluster))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.x) + 10)
          .attr('y', yScale(d.y) - 50)
          .attr('width', 150)
          .attr('height', 80)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 40)
          .text(d.cell)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 25)
          .text(`亚群: ${d.cluster}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`置信度: ${d.conf}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 5)
          .text(`分区: ${d.partition}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 20)
          .text(`坐标: (${d.x}, ${d.y})`)
          .style('font-size', '12px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Y 轴标签
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Y坐标');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('X坐标');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('亚群信息');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    clusters.forEach((cluster, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(cluster));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(cluster);
    });
  };

  // 初始化分区信息图 - 当 Tab 切换到分区信息时初始化
  useEffect(() => {
    if (activeTab === 'partition' && partitionChartRef.current) {
      updatePartitionChart(selectedPartitionRows);
      
      // 响应式
      const handleResize = () => updatePartitionChart(selectedPartitionRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedPartitionRows]);

  // 初始化亚群信息图 - 当 Tab 切换到亚群信息时初始化
  useEffect(() => {
    if (activeTab === 'cluster' && clusterChartRef.current) {
      updateClusterChart(selectedClusterRows);
      
      // 响应式
      const handleResize = () => updateClusterChart(selectedClusterRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedClusterRows]);

  // 下载处理
  const handlePartitionDownload = (selectedRowKeys) => {
    message.success(`正在下载分区信息的 ${selectedRowKeys.length} 条数据`);
  };

  const handleClusterDownload = (selectedRowKeys) => {
    message.success(`正在下载亚群信息的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handlePartitionRefresh = () => {
    message.success('已刷新分区信息数据');
    setSelectedPartitionRows(['1', '2', '3', '4', '5']);
  };

  const handleClusterRefresh = () => {
    message.success('已刷新亚群信息数据');
    setSelectedClusterRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'partition',
      label: '分区信息',
    },
    {
      key: 'cluster',
      label: '亚群信息',
    }
  ];

  return (
    <PageTemplate pageTitle="Monocle3降维图">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'partition' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={partitionChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={partitionTableColumns}
          tableData={partitionTableData}
          selectedRowKeys={selectedPartitionRows}
          onSelectChange={setSelectedPartitionRows}
          onDownload={handlePartitionDownload}
          onRefresh={handlePartitionRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'cluster' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={clusterChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={clusterTableColumns}
          tableData={clusterTableData}
          selectedRowKeys={selectedClusterRows}
          onSelectChange={setSelectedClusterRows}
          onDownload={handleClusterDownload}
          onRefresh={handleClusterRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default Monocle3DimensionReduction;