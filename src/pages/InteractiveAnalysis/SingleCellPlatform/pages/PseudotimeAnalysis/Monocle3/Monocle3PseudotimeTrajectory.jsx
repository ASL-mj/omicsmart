import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const Monocle3PseudotimeTrajectory = () => {
  const [activeTab, setActiveTab] = useState('partition');
  const partitionChartRef = useRef(null);

  // 选中的行
  const [selectedPartitionRows, setSelectedPartitionRows] = useState(['1', '2', '3', '4', '5']);

  // 分区信息图表数据
  const partitionTableData = [
    { key: '1', cell: 'Cell_001', x: 2.3, y: 1.8, pseudotime: 0.23, partition: 'Partition_A', branch: 'Branch_1' },
    { key: '2', cell: 'Cell_002', x: -1.2, y: 0.5, pseudotime: 0.45, partition: 'Partition_B', branch: 'Branch_2' },
    { key: '3', cell: 'Cell_003', x: 0.8, y: -2.1, pseudotime: 0.67, partition: 'Partition_A', branch: 'Branch_1' },
    { key: '4', cell: 'Cell_004', x: 1.5, y: 0.9, pseudotime: 0.82, partition: 'Partition_C', branch: 'Branch_3' },
    { key: '5', cell: 'Cell_005', x: -0.7, y: 1.6, pseudotime: 0.35, partition: 'Partition_B', branch: 'Branch_2' },
  ];

  const partitionTableColumns = [
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '拟时间', dataIndex: 'pseudotime', key: 'pseudotime', sorter: (a, b) => a.pseudotime - b.pseudotime },
    { title: '分区', dataIndex: 'partition', key: 'partition' },
    { title: '分支', dataIndex: 'branch', key: 'branch' },
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
    const pseudotimeMin = d3.min(selectedData, d => d.pseudotime);
    const pseudotimeMax = d3.max(selectedData, d => d.pseudotime);
    
    // X 轴比例尺
    const xScale = d3.scaleLinear()
      .domain([xMin - 0.5, xMax + 0.5])
      .range([0, width]);

    // Y 轴比例尺
    const yScale = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([height, 0]);

    // 拟时间颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([pseudotimeMin, pseudotimeMax])
      .interpolator(d3.interpolateViridis);

    // 分区颜色比例尺
    const partitions = [...new Set(selectedData.map(d => d.partition))];
    const partitionColorScale = d3.scaleOrdinal()
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
      .attr('fill', d => colorScale(d.pseudotime))
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
          .attr('height', 90)
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
          .text(`拟时间: ${d.pseudotime}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`分区: ${d.partition}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 5)
          .text(`分支: ${d.branch}`)
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
      .text('拟时间值轨迹图 - 分区信息');

    // 颜色图例 (拟时间)
    const legendWidth = 20;
    const legendHeight = 10;
    const values = d3.range(pseudotimeMin, pseudotimeMax, (pseudotimeMax - pseudotimeMin) / 50).reverse();
    
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width + 20}, 50)`);

    values.forEach((val, idx) => {
      legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', idx * legendHeight)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .attr('fill', colorScale(val));
    });

    // 颜色图例标签
    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', 0)
      .style('font-size', '10px')
      .text(pseudotimeMax.toFixed(2));

    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', values.length * legendHeight)
      .style('font-size', '10px')
      .text(pseudotimeMin.toFixed(2));

    // 分区图例
    const partitionLegend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 150)`);

    partitions.forEach((partition, i) => {
      const legendRow = partitionLegend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', partitionColorScale(partition));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(partition);
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

  // 下载处理
  const handlePartitionDownload = (selectedRowKeys) => {
    message.success(`正在下载拟时间值轨迹图分区信息的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handlePartitionRefresh = () => {
    message.success('已刷新拟时间值轨迹图分区信息数据');
    setSelectedPartitionRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'partition',
      label: '分区信息',
    }
  ];

  return (
    <PageTemplate pageTitle="拟时间值轨迹图">
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
    </PageTemplate>
  );
};

export default Monocle3PseudotimeTrajectory;