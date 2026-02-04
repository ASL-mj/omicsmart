import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const Monocle2PseudotimeDEG = () => {
  const [activeTab, setActiveTab] = useState('trajectory');
  const trajectoryChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const curveChartRef = useRef(null);
  const heatmapChartRef = useRef(null);

  // 选中的行
  const [selectedTrajectoryRows, setSelectedTrajectoryRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedScatterRows, setSelectedScatterRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedCurveRows, setSelectedCurveRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedHeatmapRows, setSelectedHeatmapRows] = useState(['1', '2', '3', '4', '5']);

  // 细胞轨迹图表数据
  const trajectoryTableData = [
    { key: '1', gene: 'GENE_001', expression: 2.3, pseudotime: 0.2, cell: 'Cell_001', cluster: 'Cluster_1' },
    { key: '2', gene: 'GENE_002', expression: 1.8, pseudotime: 0.4, cell: 'Cell_002', cluster: 'Cluster_2' },
    { key: '3', gene: 'GENE_003', expression: 3.1, pseudotime: 0.6, cell: 'Cell_003', cluster: 'Cluster_1' },
    { key: '4', gene: 'GENE_004', expression: 2.7, pseudotime: 0.8, cell: 'Cell_004', cluster: 'Cluster_3' },
    { key: '5', gene: 'GENE_005', expression: 1.9, pseudotime: 0.9, cell: 'Cell_005', cluster: 'Cluster_2' },
  ];

  const trajectoryTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '拟时间', dataIndex: 'pseudotime', key: 'pseudotime', sorter: (a, b) => a.pseudotime - b.pseudotime },
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
  ];

  // 散点图表数据
  const scatterTableData = [
    { key: '1', gene: 'GENE_001', expression: 2.3, pseudotime: 0.2, correlation: 0.85 },
    { key: '2', gene: 'GENE_002', expression: 1.8, pseudotime: 0.4, correlation: 0.72 },
    { key: '3', gene: 'GENE_003', expression: 3.1, pseudotime: 0.6, correlation: 0.91 },
    { key: '4', gene: 'GENE_004', expression: 2.7, pseudotime: 0.8, correlation: 0.68 },
    { key: '5', gene: 'GENE_005', expression: 1.9, pseudotime: 0.9, correlation: 0.79 },
  ];

  const scatterTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '拟时间', dataIndex: 'pseudotime', key: 'pseudotime', sorter: (a, b) => a.pseudotime - b.pseudotime },
    { title: '相关性', dataIndex: 'correlation', key: 'correlation', sorter: (a, b) => a.correlation - b.correlation },
  ];

  // 曲线图表数据
  const curveTableData = [
    { key: '1', gene: 'GENE_001', expr_p0: 1.2, expr_p2: 1.8, expr_p4: 2.4, expr_p6: 3.1, expr_p8: 2.9 },
    { key: '2', gene: 'GENE_002', expr_p0: 2.1, expr_p2: 1.9, expr_p4: 1.7, expr_p6: 1.5, expr_p8: 1.3 },
    { key: '3', gene: 'GENE_003', expr_p0: 0.8, expr_p2: 1.2, expr_p4: 1.8, expr_p6: 2.3, expr_p8: 2.7 },
    { key: '4', gene: 'GENE_004', expr_p0: 2.5, expr_p2: 2.3, expr_p4: 2.0, expr_p6: 1.8, expr_p8: 1.6 },
    { key: '5', gene: 'GENE_005', expr_p0: 1.0, expr_p2: 1.4, expr_p4: 1.9, expr_p6: 2.5, expr_p8: 3.0 },
  ];

  const curveTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: 'P0', dataIndex: 'expr_p0', key: 'expr_p0', sorter: (a, b) => a.expr_p0 - b.expr_p0 },
    { title: 'P2', dataIndex: 'expr_p2', key: 'expr_p2', sorter: (a, b) => a.expr_p2 - b.expr_p2 },
    { title: 'P4', dataIndex: 'expr_p4', key: 'expr_p4', sorter: (a, b) => a.expr_p4 - b.expr_p4 },
    { title: 'P6', dataIndex: 'expr_p6', key: 'expr_p6', sorter: (a, b) => a.expr_p6 - b.expr_p6 },
    { title: 'P8', dataIndex: 'expr_p8', key: 'expr_p8', sorter: (a, b) => a.expr_p8 - b.expr_p8 },
  ];

  // 热图表数据
  const heatmapTableData = [
    { key: '1', gene: 'GENE_001', expr_s1: 1.2, expr_s2: 1.8, expr_s3: 2.4, expr_s4: 3.1, expr_s5: 2.9 },
    { key: '2', gene: 'GENE_002', expr_s1: 2.1, expr_s2: 1.9, expr_s3: 1.7, expr_s4: 1.5, expr_s5: 1.3 },
    { key: '3', gene: 'GENE_003', expr_s1: 0.8, expr_s2: 1.2, expr_s3: 1.8, expr_s4: 2.3, expr_s5: 2.7 },
    { key: '4', gene: 'GENE_004', expr_s1: 2.5, expr_s2: 2.3, expr_s3: 2.0, expr_s4: 1.8, expr_s5: 1.6 },
    { key: '5', gene: 'GENE_005', expr_s1: 1.0, expr_s2: 1.4, expr_s3: 1.9, expr_s4: 2.5, expr_s5: 3.0 },
  ];

  const heatmapTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '样本1', dataIndex: 'expr_s1', key: 'expr_s1', sorter: (a, b) => a.expr_s1 - b.expr_s1 },
    { title: '样本2', dataIndex: 'expr_s2', key: 'expr_s2', sorter: (a, b) => a.expr_s2 - b.expr_s2 },
    { title: '样本3', dataIndex: 'expr_s3', key: 'expr_s3', sorter: (a, b) => a.expr_s3 - b.expr_s3 },
    { title: '样本4', dataIndex: 'expr_s4', key: 'expr_s4', sorter: (a, b) => a.expr_s4 - b.expr_s4 },
    { title: '样本5', dataIndex: 'expr_s5', key: 'expr_s5', sorter: (a, b) => a.expr_s5 - b.expr_s5 },
  ];

  // 更新细胞轨迹图 (D3)
  const updateTrajectoryChart = (selectedKeys) => {
    if (!trajectoryChartRef.current) return;

    // 清空之前的内容
    d3.select(trajectoryChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = trajectoryTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = trajectoryChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(trajectoryChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const pseudotimeMin = d3.min(selectedData, d => d.pseudotime);
    const pseudotimeMax = d3.max(selectedData, d => d.pseudotime);
    const expressionMin = d3.min(selectedData, d => d.expression);
    const expressionMax = d3.max(selectedData, d => d.expression);
    
    // X 轴比例尺 (拟时间)
    const xScale = d3.scaleLinear()
      .domain([pseudotimeMin - 0.05, pseudotimeMax + 0.05])
      .range([0, width]);

    // Y 轴比例尺 (表达量)
    const yScale = d3.scaleLinear()
      .domain([expressionMin - 0.5, expressionMax + 0.5])
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
      .attr('cx', d => xScale(d.pseudotime))
      .attr('cy', d => yScale(d.expression))
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
          .attr('x', xScale(d.pseudotime) + 10)
          .attr('y', yScale(d.expression) - 50)
          .attr('width', 150)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) - 40)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) - 25)
          .text(`表达量: ${d.expression}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) - 10)
          .text(`拟时间: ${d.pseudotime}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) + 5)
          .text(`亚群: ${d.cluster}`)
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
      .text('表达量');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('拟时间');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('细胞轨迹图');

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

  // 更新散点图 (D3)
  const updateScatterChart = (selectedKeys) => {
    if (!scatterChartRef.current) return;

    // 清空之前的内容
    d3.select(scatterChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = scatterTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = scatterChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(scatterChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const pseudotimeMin = d3.min(selectedData, d => d.pseudotime);
    const pseudotimeMax = d3.max(selectedData, d => d.pseudotime);
    const expressionMin = d3.min(selectedData, d => d.expression);
    const expressionMax = d3.max(selectedData, d => d.expression);
    
    // X 轴比例尺 (拟时间)
    const xScale = d3.scaleLinear()
      .domain([pseudotimeMin - 0.05, pseudotimeMax + 0.05])
      .range([0, width]);

    // Y 轴比例尺 (表达量)
    const yScale = d3.scaleLinear()
      .domain([expressionMin - 0.5, expressionMax + 0.5])
      .range([height, 0]);

    // 相关性颜色比例尺
    const corrMin = d3.min(selectedData, d => d.correlation);
    const corrMax = d3.max(selectedData, d => d.correlation);
    const colorScale = d3.scaleSequential()
      .domain([corrMin, corrMax])
      .interpolator(d3.interpolateBlues);

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.pseudotime))
      .attr('cy', d => yScale(d.expression))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.correlation))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.pseudotime) + 10)
          .attr('y', yScale(d.expression) - 50)
          .attr('width', 150)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) - 40)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) - 25)
          .text(`表达量: ${d.expression}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) - 10)
          .text(`拟时间: ${d.pseudotime}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.pseudotime) + 15)
          .attr('y', yScale(d.expression) + 5)
          .text(`相关性: ${d.correlation}`)
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
      .text('表达量');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('拟时间');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('散点图');

    // 颜色图例
    const legendWidth = 20;
    const legendHeight = 10;
    const values = d3.range(corrMin, corrMax, (corrMax - corrMin) / 50).reverse();
    
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
      .text(corrMax.toFixed(2));

    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', values.length * legendHeight)
      .style('font-size', '10px')
      .text(corrMin.toFixed(2));
  };

  // 更新曲线图 (D3)
  const updateCurveChart = (selectedKeys) => {
    if (!curveChartRef.current) return;

    // 清空之前的内容
    d3.select(curveChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = curveTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = curveChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(curveChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const timePoints = ['expr_p0', 'expr_p2', 'expr_p4', 'expr_p6', 'expr_p8'];
    const timeLabels = ['P0', 'P2', 'P4', 'P6', 'P8'];
    const expressionMin = d3.min(selectedData, d => Math.min(d.expr_p0, d.expr_p2, d.expr_p4, d.expr_p6, d.expr_p8));
    const expressionMax = d3.max(selectedData, d => Math.max(d.expr_p0, d.expr_p2, d.expr_p4, d.expr_p6, d.expr_p8));
    
    // X 轴比例尺 (时间点)
    const xScale = d3.scalePoint()
      .domain(timeLabels)
      .range([0, width]);

    // Y 轴比例尺 (表达量)
    const yScale = d3.scaleLinear()
      .domain([expressionMin - 0.5, expressionMax + 0.5])
      .range([height, 0]);

    // 颜色比例尺
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 定义线条生成器
    const line = d3.line()
      .x((d, i) => xScale(timeLabels[i]))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    // 绘制每条基因的曲线
    selectedData.forEach((d, i) => {
      const values = [d.expr_p0, d.expr_p2, d.expr_p4, d.expr_p6, d.expr_p8];
      
      svg.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', colorScale(i))
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('opacity', 0.7);
        
      // 添加数据点
      timeLabels.forEach((label, j) => {
        svg.append('circle')
          .attr('cx', xScale(label))
          .attr('cy', yScale(values[j]))
          .attr('r', 5)
          .attr('fill', colorScale(i))
          .attr('opacity', 0.7)
          .on('mouseover', function() {
            d3.select(this).attr('r', 7).attr('opacity', 1);
            
            // 显示提示信息
            const tooltip = svg.append('g')
              .attr('class', 'tooltip')
              .attr('pointer-events', 'none');
              
            tooltip.append('rect')
              .attr('x', xScale(label) + 10)
              .attr('y', yScale(values[j]) - 40)
              .attr('width', 150)
              .attr('height', 60)
              .attr('fill', 'white')
              .attr('stroke', 'black')
              .attr('stroke-width', 1)
              .attr('rx', 5)
              .attr('ry', 5);
              
            tooltip.append('text')
              .attr('x', xScale(label) + 15)
              .attr('y', yScale(values[j]) - 30)
              .text(`${d.gene}`)
              .style('font-size', '12px')
              .style('font-weight', 'bold');
              
            tooltip.append('text')
              .attr('x', xScale(label) + 15)
              .attr('y', yScale(values[j]) - 15)
              .text(`时间点: ${label}`)
              .style('font-size', '12px');
              
            tooltip.append('text')
              .attr('x', xScale(label) + 15)
              .attr('y', yScale(values[j]))
              .text(`表达量: ${values[j]}`)
              .style('font-size', '12px');
          })
          .on('mouseout', function() {
            d3.select(this).attr('r', 5).attr('opacity', 0.7);
            svg.selectAll('.tooltip').remove();
          });
      });
    });

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
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
      .text('表达量');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('时间点');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('曲线图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    selectedData.forEach((d, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('line')
        .attr('x1', 0)
        .attr('y1', 5)
        .attr('x2', 20)
        .attr('y2', 5)
        .attr('stroke', colorScale(i))
        .attr('stroke-width', 2);

      legendRow.append('text')
        .attr('x', 25)
        .attr('y', 8)
        .style('font-size', '12px')
        .text(d.gene);
    });
  };

  // 更新热图 (D3)
  const updateHeatmapChart = (selectedKeys) => {
    if (!heatmapChartRef.current) return;

    // 清空之前的内容
    d3.select(heatmapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = heatmapTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = heatmapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(heatmapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义样本
    const samples = ['expr_s1', 'expr_s2', 'expr_s3', 'expr_s4', 'expr_s5'];
    const sampleNames = ['样本1', '样本2', '样本3', '样本4', '样本5'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      samples.forEach(s => allValues.push(d[s]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // 创建颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRdYlBu);

    // 计算单元格尺寸
    const cellWidth = width / samples.length;
    const cellHeight = height / selectedData.length;

    // 绘制热图矩阵
    selectedData.forEach((d, i) => {
      samples.forEach((s, j) => {
        const value = d[s];
        const x = j * cellWidth;
        const y = i * cellHeight;
        
        // 绘制矩形
        svg.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('fill', colorScale(value))
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);
          
        // 添加数值标签
        svg.append('text')
          .attr('x', x + cellWidth / 2)
          .attr('y', y + cellHeight / 2)
          .attr('dy', '0.35em')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', value > (maxVal - minVal) / 2 ? 'white' : 'black')
          .text(value.toFixed(1));
      });
    });

    // 添加列标签 (样本)
    samples.forEach((s, j) => {
      svg.append('text')
        .attr('x', j * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(sampleNames[j]);
    });

    // 添加行标签 (基因)
    selectedData.forEach((d, i) => {
      svg.append('text')
        .attr('x', -10)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .text(d.gene);
    });

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('热图');

    // 颜色图例
    const legendWidth = 20;
    const legendHeight = 10;
    const values = d3.range(minVal, maxVal, (maxVal - minVal) / 50).reverse();
    
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
      .text(maxVal.toFixed(1));

    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', values.length * legendHeight)
      .style('font-size', '10px')
      .text(minVal.toFixed(1));
  };

  // 初始化细胞轨迹图 - 当 Tab 切换到细胞轨迹图时初始化
  useEffect(() => {
    if (activeTab === 'trajectory' && trajectoryChartRef.current) {
      updateTrajectoryChart(selectedTrajectoryRows);
      
      // 响应式
      const handleResize = () => updateTrajectoryChart(selectedTrajectoryRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedTrajectoryRows]);

  // 初始化散点图 - 当 Tab 切换到散点图时初始化
  useEffect(() => {
    if (activeTab === 'scatter' && scatterChartRef.current) {
      updateScatterChart(selectedScatterRows);
      
      // 响应式
      const handleResize = () => updateScatterChart(selectedScatterRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedScatterRows]);

  // 初始化曲线图 - 当 Tab 切换到曲线图时初始化
  useEffect(() => {
    if (activeTab === 'curve' && curveChartRef.current) {
      updateCurveChart(selectedCurveRows);
      
      // 响应式
      const handleResize = () => updateCurveChart(selectedCurveRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedCurveRows]);

  // 初始化热图 - 当 Tab 切换到热图时初始化
  useEffect(() => {
    if (activeTab === 'heatmap' && heatmapChartRef.current) {
      updateHeatmapChart(selectedHeatmapRows);
      
      // 响应式
      const handleResize = () => updateHeatmapChart(selectedHeatmapRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedHeatmapRows]);

  // 下载处理
  const handleTrajectoryDownload = (selectedRowKeys) => {
    message.success(`正在下载细胞轨迹图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleScatterDownload = (selectedRowKeys) => {
    message.success(`正在下载散点图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleCurveDownload = (selectedRowKeys) => {
    message.success(`正在下载曲线图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleHeatmapDownload = (selectedRowKeys) => {
    message.success(`正在下载热图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleTrajectoryRefresh = () => {
    message.success('已刷新细胞轨迹图数据');
    setSelectedTrajectoryRows(['1', '2', '3', '4', '5']);
  };

  const handleScatterRefresh = () => {
    message.success('已刷新散点图数据');
    setSelectedScatterRows(['1', '2', '3', '4', '5']);
  };

  const handleCurveRefresh = () => {
    message.success('已刷新曲线图数据');
    setSelectedCurveRows(['1', '2', '3', '4', '5']);
  };

  const handleHeatmapRefresh = () => {
    message.success('已刷新热图数据');
    setSelectedHeatmapRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'trajectory',
      label: '细胞轨迹图',
    },
    {
      key: 'scatter',
      label: '散点图',
    },
    {
      key: 'curve',
      label: '曲线图',
    },
    {
      key: 'heatmap',
      label: '热图',
    }
  ];

  return (
    <PageTemplate pageTitle="拟时间轴差异基因">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'trajectory' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={trajectoryChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={trajectoryTableColumns}
          tableData={trajectoryTableData}
          selectedRowKeys={selectedTrajectoryRows}
          onSelectChange={setSelectedTrajectoryRows}
          onDownload={handleTrajectoryDownload}
          onRefresh={handleTrajectoryRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'scatter' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={scatterChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={scatterTableColumns}
          tableData={scatterTableData}
          selectedRowKeys={selectedScatterRows}
          onSelectChange={setSelectedScatterRows}
          onDownload={handleScatterDownload}
          onRefresh={handleScatterRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'curve' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={curveChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={curveTableColumns}
          tableData={curveTableData}
          selectedRowKeys={selectedCurveRows}
          onSelectChange={setSelectedCurveRows}
          onDownload={handleCurveDownload}
          onRefresh={handleCurveRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'heatmap' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={heatmapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={heatmapTableColumns}
          tableData={heatmapTableData}
          selectedRowKeys={selectedHeatmapRows}
          onSelectChange={setSelectedHeatmapRows}
          onDownload={handleHeatmapDownload}
          onRefresh={handleHeatmapRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default Monocle2PseudotimeDEG;