import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const PAGAScatter = () => {
  const [activeTab, setActiveTab] = useState('pseudotime');
  const pseudotimeChartRef = useRef(null);
  const sampleChartRef = useRef(null);
  const clusterChartRef = useRef(null);

  // 选中的行
  const [selectedPseudotimeRows, setSelectedPseudotimeRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedSampleRows, setSelectedSampleRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedClusterRows, setSelectedClusterRows] = useState(['1', '2', '3', '4', '5']);

  // 拟时间信息图表数据
  const pseudotimeTableData = [
    { key: '1', cell: 'Cell_001', x: 2.3, y: 1.8, pseudotime: 0.23, state: 'State_1', cluster: 'Cluster_1' },
    { key: '2', cell: 'Cell_002', x: -1.2, y: 0.5, pseudotime: 0.45, state: 'State_2', cluster: 'Cluster_2' },
    { key: '3', cell: 'Cell_003', x: 0.8, y: -2.1, pseudotime: 0.67, state: 'State_2', cluster: 'Cluster_2' },
    { key: '4', cell: 'Cell_004', x: 1.5, y: 0.9, pseudotime: 0.82, state: 'State_3', cluster: 'Cluster_3' },
    { key: '5', cell: 'Cell_005', x: -0.7, y: 1.6, pseudotime: 0.35, state: 'State_1', cluster: 'Cluster_1' },
  ];

  const pseudotimeTableColumns = [
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '拟时间', dataIndex: 'pseudotime', key: 'pseudotime', sorter: (a, b) => a.pseudotime - b.pseudotime },
    { title: '状态', dataIndex: 'state', key: 'state' },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
  ];

  // 样本信息图表数据
  const sampleTableData = [
    { key: '1', cell: 'Cell_001', x: 2.3, y: 1.8, sample: 'Sample_A', batch: 'Batch_1', cluster: 'Cluster_1' },
    { key: '2', cell: 'Cell_002', x: -1.2, y: 0.5, sample: 'Sample_B', batch: 'Batch_2', cluster: 'Cluster_2' },
    { key: '3', cell: 'Cell_003', x: 0.8, y: -2.1, sample: 'Sample_B', batch: 'Batch_2', cluster: 'Cluster_2' },
    { key: '4', cell: 'Cell_004', x: 1.5, y: 0.9, sample: 'Sample_C', batch: 'Batch_1', cluster: 'Cluster_3' },
    { key: '5', cell: 'Cell_005', x: -0.7, y: 1.6, sample: 'Sample_A', batch: 'Batch_1', cluster: 'Cluster_1' },
  ];

  const sampleTableColumns = [
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '样本', dataIndex: 'sample', key: 'sample' },
    { title: '批次', dataIndex: 'batch', key: 'batch' },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
  ];

  // 亚群信息图表数据
  const clusterTableData = [
    { key: '1', cell: 'Cell_001', x: 2.3, y: 1.8, cluster: 'Epithelial', conf: 0.92, state: 'State_1' },
    { key: '2', cell: 'Cell_002', x: -1.2, y: 0.5, cluster: 'Stromal', conf: 0.85, state: 'State_2' },
    { key: '3', cell: 'Cell_003', x: 0.8, y: -2.1, cluster: 'Immune', conf: 0.78, state: 'State_2' },
    { key: '4', cell: 'Cell_004', x: 1.5, y: 0.9, cluster: 'Epithelial', conf: 0.94, state: 'State_3' },
    { key: '5', cell: 'Cell_005', x: -0.7, y: 1.6, cluster: 'Stromal', conf: 0.87, state: 'State_1' },
  ];

  const clusterTableColumns = [
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '置信度', dataIndex: 'conf', key: 'conf', sorter: (a, b) => a.conf - b.conf },
    { title: '状态', dataIndex: 'state', key: 'state' },
  ];

  // 更新拟时间信息散点图 (D3)
  const updatePseudotimeChart = (selectedKeys) => {
    if (!pseudotimeChartRef.current) return;

    // 清空之前的内容
    d3.select(pseudotimeChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = pseudotimeTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = pseudotimeChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(pseudotimeChartRef.current)
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

    // 拟时间颜色比例尺
    const pseudotimeMin = d3.min(selectedData, d => d.pseudotime);
    const pseudotimeMax = d3.max(selectedData, d => d.pseudotime);
    const colorScale = d3.scaleSequential()
      .domain([pseudotimeMin, pseudotimeMax])
      .interpolator(d3.interpolateViridis);

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
          .text(`拟时间: ${d.pseudotime}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`状态: ${d.state}`)
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
      .text('拟时间信息');

    // 颜色图例
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
  };

  // 更新样本信息散点图 (D3)
  const updateSampleChart = (selectedKeys) => {
    if (!sampleChartRef.current) return;

    // 清空之前的内容
    d3.select(sampleChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = sampleTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = sampleChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(sampleChartRef.current)
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

    // 样本颜色比例尺
    const samples = [...new Set(selectedData.map(d => d.sample))];
    const colorScale = d3.scaleOrdinal()
      .domain(samples)
      .range(d3.schemeCategory10.slice(0, samples.length));

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.sample))
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
          .text(`样本: ${d.sample}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`批次: ${d.batch}`)
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
      .text('样本信息');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    samples.forEach((sample, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(sample));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(sample);
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
          .text(`状态: ${d.state}`)
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

  // 初始化拟时间信息图 - 当 Tab 切换到拟时间信息时初始化
  useEffect(() => {
    if (activeTab === 'pseudotime' && pseudotimeChartRef.current) {
      updatePseudotimeChart(selectedPseudotimeRows);
      
      // 响应式
      const handleResize = () => updatePseudotimeChart(selectedPseudotimeRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedPseudotimeRows]);

  // 初始化样本信息图 - 当 Tab 切换到样本信息时初始化
  useEffect(() => {
    if (activeTab === 'sample' && sampleChartRef.current) {
      updateSampleChart(selectedSampleRows);
      
      // 响应式
      const handleResize = () => updateSampleChart(selectedSampleRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedSampleRows]);

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
  const handlePseudotimeDownload = (selectedRowKeys) => {
    message.success(`正在下载拟时间信息的 ${selectedRowKeys.length} 条数据`);
  };

  const handleSampleDownload = (selectedRowKeys) => {
    message.success(`正在下载样本信息的 ${selectedRowKeys.length} 条数据`);
  };

  const handleClusterDownload = (selectedRowKeys) => {
    message.success(`正在下载亚群信息的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handlePseudotimeRefresh = () => {
    message.success('已刷新拟时间信息数据');
    setSelectedPseudotimeRows(['1', '2', '3', '4', '5']);
  };

  const handleSampleRefresh = () => {
    message.success('已刷新样本信息数据');
    setSelectedSampleRows(['1', '2', '3', '4', '5']);
  };

  const handleClusterRefresh = () => {
    message.success('已刷新亚群信息数据');
    setSelectedClusterRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'pseudotime',
      label: '拟时间信息',
    },
    {
      key: 'sample',
      label: '样本信息',
    },
    {
      key: 'cluster',
      label: '亚群信息',
    }
  ];

  return (
    <PageTemplate pageTitle="分化散点图">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'pseudotime' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={pseudotimeChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={pseudotimeTableColumns}
          tableData={pseudotimeTableData}
          selectedRowKeys={selectedPseudotimeRows}
          onSelectChange={setSelectedPseudotimeRows}
          onDownload={handlePseudotimeDownload}
          onRefresh={handlePseudotimeRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'sample' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={sampleChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={sampleTableColumns}
          tableData={sampleTableData}
          selectedRowKeys={selectedSampleRows}
          onSelectChange={setSelectedSampleRows}
          onDownload={handleSampleDownload}
          onRefresh={handleSampleRefresh}
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

export default PAGAScatter;