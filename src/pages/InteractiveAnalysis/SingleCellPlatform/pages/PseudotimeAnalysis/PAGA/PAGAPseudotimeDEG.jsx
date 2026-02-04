import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const PAGAPseudotimeDEG = () => {
  const [activeTab, setActiveTab] = useState('diffScatter');
  const diffScatterChartRef = useRef(null);
  const diffGridChartRef = useRef(null);
  const trendScatterChartRef = useRef(null);
  const trendHeatmapChartRef = useRef(null);

  // 选中的行
  const [selectedDiffScatterRows, setSelectedDiffScatterRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedDiffGridRows, setSelectedDiffGridRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedTrendScatterRows, setSelectedTrendScatterRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedTrendHeatmapRows, setSelectedTrendHeatmapRows] = useState(['1', '2', '3', '4', '5']);

  // 分化散点图表数据
  const diffScatterTableData = [
    { key: '1', gene: 'GENE_001', expression: 2.3, pseudotime: 0.23, cluster: 'Cluster_1', cell: 'Cell_001' },
    { key: '2', gene: 'GENE_002', expression: 1.8, pseudotime: 0.45, cluster: 'Cluster_2', cell: 'Cell_002' },
    { key: '3', gene: 'GENE_003', expression: 3.1, pseudotime: 0.67, cluster: 'Cluster_2', cell: 'Cell_003' },
    { key: '4', gene: 'GENE_004', expression: 2.7, pseudotime: 0.82, cluster: 'Cluster_3', cell: 'Cell_004' },
    { key: '5', gene: 'GENE_005', expression: 1.9, pseudotime: 0.35, cluster: 'Cluster_1', cell: 'Cell_005' },
  ];

  const diffScatterTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '拟时间', dataIndex: 'pseudotime', key: 'pseudotime', sorter: (a, b) => a.pseudotime - b.pseudotime },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
  ];

  // 分化网格图表数据
  const diffGridTableData = [
    { key: '1', gene: 'GENE_001', pathway: 'Pathway_A', enrichment_score: 0.85, p_value: 0.001, fdr: 0.01 },
    { key: '2', gene: 'GENE_002', pathway: 'Pathway_B', enrichment_score: 0.72, p_value: 0.003, fdr: 0.02 },
    { key: '3', gene: 'GENE_003', pathway: 'Pathway_C', enrichment_score: 0.91, p_value: 0.0005, fdr: 0.005 },
    { key: '4', gene: 'GENE_004', pathway: 'Pathway_A', enrichment_score: 0.68, p_value: 0.008, fdr: 0.05 },
    { key: '5', gene: 'GENE_005', pathway: 'Pathway_D', enrichment_score: 0.79, p_value: 0.002, fdr: 0.015 },
  ];

  const diffGridTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '通路', dataIndex: 'pathway', key: 'pathway' },
    { title: '富集得分', dataIndex: 'enrichment_score', key: 'enrichment_score', sorter: (a, b) => a.enrichment_score - b.enrichment_score },
    { title: 'P值', dataIndex: 'p_value', key: 'p_value', sorter: (a, b) => a.p_value - b.p_value },
    { title: 'FDR', dataIndex: 'fdr', key: 'fdr', sorter: (a, b) => a.fdr - b.fdr },
  ];

  // 趋势散点图表数据
  const trendScatterTableData = [
    { key: '1', gene: 'GENE_001', expression: 2.3, trend: 'Increasing', significance: 0.001, correlation: 0.85 },
    { key: '2', gene: 'GENE_002', expression: 1.8, trend: 'Decreasing', significance: 0.003, correlation: -0.72 },
    { key: '3', gene: 'GENE_003', expression: 3.1, trend: 'Increasing', significance: 0.0005, correlation: 0.91 },
    { key: '4', gene: 'GENE_004', expression: 2.7, trend: 'Stable', significance: 0.008, correlation: 0.05 },
    { key: '5', gene: 'GENE_005', expression: 1.9, trend: 'Increasing', significance: 0.002, correlation: 0.68 },
  ];

  const trendScatterTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '趋势', dataIndex: 'trend', key: 'trend' },
    { title: '显著性', dataIndex: 'significance', key: 'significance', sorter: (a, b) => a.significance - b.significance },
    { title: '相关系数', dataIndex: 'correlation', key: 'correlation', sorter: (a, b) => a.correlation - b.correlation },
  ];

  // 趋势热图表数据
  const trendHeatmapTableData = [
    { key: '1', gene: 'GENE_001', expr_p0: 1.2, expr_p2: 1.8, expr_p4: 2.4, expr_p6: 3.1, expr_p8: 2.9 },
    { key: '2', gene: 'GENE_002', expr_p0: 2.1, expr_p2: 1.9, expr_p4: 1.7, expr_p6: 1.5, expr_p8: 1.3 },
    { key: '3', gene: 'GENE_003', expr_p0: 0.8, expr_p2: 1.2, expr_p4: 1.8, expr_p6: 2.3, expr_p8: 2.7 },
    { key: '4', gene: 'GENE_004', expr_p0: 2.5, expr_p2: 2.3, expr_p4: 2.0, expr_p6: 1.8, expr_p8: 1.6 },
    { key: '5', gene: 'GENE_005', expr_p0: 1.0, expr_p2: 1.4, expr_p4: 1.9, expr_p6: 2.5, expr_p8: 3.0 },
  ];

  const trendHeatmapTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: 'P0', dataIndex: 'expr_p0', key: 'expr_p0', sorter: (a, b) => a.expr_p0 - b.expr_p0 },
    { title: 'P2', dataIndex: 'expr_p2', key: 'expr_p2', sorter: (a, b) => a.expr_p2 - b.expr_p2 },
    { title: 'P4', dataIndex: 'expr_p4', key: 'expr_p4', sorter: (a, b) => a.expr_p4 - b.expr_p4 },
    { title: 'P6', dataIndex: 'expr_p6', key: 'expr_p6', sorter: (a, b) => a.expr_p6 - b.expr_p6 },
    { title: 'P8', dataIndex: 'expr_p8', key: 'expr_p8', sorter: (a, b) => a.expr_p8 - b.expr_p8 },
  ];

  // 更新分化散点图 (D3)
  const updateDiffScatterChart = (selectedKeys) => {
    if (!diffScatterChartRef.current) return;

    // 清空之前的内容
    d3.select(diffScatterChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = diffScatterTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = diffScatterChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(diffScatterChartRef.current)
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
      .text('分化散点图');

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

  // 更新分化网格图 (D3)
  const updateDiffGridChart = (selectedKeys) => {
    if (!diffGridChartRef.current) return;

    // 清空之前的内容
    d3.select(diffGridChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = diffGridTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = diffGridChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(diffGridChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const enrichmentMin = d3.min(selectedData, d => d.enrichment_score);
    const enrichmentMax = d3.max(selectedData, d => d.enrichment_score);
    const pValueMin = d3.min(selectedData, d => d.p_value);
    const pValueMax = d3.max(selectedData, d => d.p_value);
    
    // X 轴比例尺 (富集得分)
    const xScale = d3.scaleLinear()
      .domain([enrichmentMin - 0.05, enrichmentMax + 0.05])
      .range([0, width]);

    // Y 轴比例尺 (P值，对数变换)
    const yScale = d3.scaleLog()
      .domain([Math.max(0.0001, pValueMin), pValueMax])
      .range([height, 0]);

    // 通路颜色比例尺
    const pathways = [...new Set(selectedData.map(d => d.pathway))];
    const colorScale = d3.scaleOrdinal()
      .domain(pathways)
      .range(d3.schemeCategory10.slice(0, pathways.length));

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.enrichment_score))
      .attr('cy', d => yScale(d.p_value))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.pathway))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.enrichment_score) + 10)
          .attr('y', yScale(d.p_value) - 50)
          .attr('width', 150)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.enrichment_score) + 15)
          .attr('y', yScale(d.p_value) - 40)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.enrichment_score) + 15)
          .attr('y', yScale(d.p_value) - 25)
          .text(`通路: ${d.pathway}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.enrichment_score) + 15)
          .attr('y', yScale(d.p_value) - 10)
          .text(`富集得分: ${d.enrichment_score}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.enrichment_score) + 15)
          .attr('y', yScale(d.p_value) + 5)
          .text(`P值: ${d.p_value}`)
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
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".4f")))
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
      .text('P值 (对数)');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('富集得分');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('分化网格图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    pathways.forEach((pathway, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(pathway));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(pathway);
    });
  };

  // 更新趋势散点图 (D3)
  const updateTrendScatterChart = (selectedKeys) => {
    if (!trendScatterChartRef.current) return;

    // 清空之前的内容
    d3.select(trendScatterChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = trendScatterTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = trendScatterChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(trendScatterChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const correlationMin = d3.min(selectedData, d => d.correlation);
    const correlationMax = d3.max(selectedData, d => d.correlation);
    const expressionMin = d3.min(selectedData, d => d.expression);
    const expressionMax = d3.max(selectedData, d => d.expression);
    
    // X 轴比例尺 (相关系数)
    const xScale = d3.scaleLinear()
      .domain([correlationMin - 0.1, correlationMax + 0.1])
      .range([0, width]);

    // Y 轴比例尺 (表达量)
    const yScale = d3.scaleLinear()
      .domain([expressionMin - 0.5, expressionMax + 0.5])
      .range([height, 0]);

    // 趋势颜色比例尺
    const trends = [...new Set(selectedData.map(d => d.trend))];
    const colorScale = d3.scaleOrdinal()
      .domain(trends)
      .range(d3.schemeCategory10.slice(0, trends.length));

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.correlation))
      .attr('cy', d => yScale(d.expression))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.trend))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.correlation) + 10)
          .attr('y', yScale(d.expression) - 50)
          .attr('width', 150)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.correlation) + 15)
          .attr('y', yScale(d.expression) - 40)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.correlation) + 15)
          .attr('y', yScale(d.expression) - 25)
          .text(`表达量: ${d.expression}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.correlation) + 15)
          .attr('y', yScale(d.expression) - 10)
          .text(`趋势: ${d.trend}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.correlation) + 15)
          .attr('y', yScale(d.expression) + 5)
          .text(`相关系数: ${d.correlation}`)
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
      .text('相关系数');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('趋势散点图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    trends.forEach((trend, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(trend));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(trend);
    });
  };

  // 更新趋势热图 (D3)
  const updateTrendHeatmapChart = (selectedKeys) => {
    if (!trendHeatmapChartRef.current) return;

    // 清空之前的内容
    d3.select(trendHeatmapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = trendHeatmapTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = trendHeatmapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(trendHeatmapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义时间点
    const timePoints = ['expr_p0', 'expr_p2', 'expr_p4', 'expr_p6', 'expr_p8'];
    const timeLabels = ['P0', 'P2', 'P4', 'P6', 'P8'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      timePoints.forEach(tp => allValues.push(d[tp]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // 创建颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRdYlBu);

    // 计算单元格尺寸
    const cellWidth = width / timePoints.length;
    const cellHeight = height / selectedData.length;

    // 绘制热图矩阵
    selectedData.forEach((d, i) => {
      timePoints.forEach((tp, j) => {
        const value = d[tp];
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

    // 添加列标签 (时间点)
    timePoints.forEach((tp, j) => {
      svg.append('text')
        .attr('x', j * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(timeLabels[j]);
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
      .text('趋势热图');

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

  // 初始化分化散点图 - 当 Tab 切换到分化散点图时初始化
  useEffect(() => {
    if (activeTab === 'diffScatter' && diffScatterChartRef.current) {
      updateDiffScatterChart(selectedDiffScatterRows);
      
      // 响应式
      const handleResize = () => updateDiffScatterChart(selectedDiffScatterRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedDiffScatterRows]);

  // 初始化分化网格图 - 当 Tab 切换到分化网格图时初始化
  useEffect(() => {
    if (activeTab === 'diffGrid' && diffGridChartRef.current) {
      updateDiffGridChart(selectedDiffGridRows);
      
      // 响应式
      const handleResize = () => updateDiffGridChart(selectedDiffGridRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedDiffGridRows]);

  // 初始化趋势散点图 - 当 Tab 切换到趋势散点图时初始化
  useEffect(() => {
    if (activeTab === 'trendScatter' && trendScatterChartRef.current) {
      updateTrendScatterChart(selectedTrendScatterRows);
      
      // 响应式
      const handleResize = () => updateTrendScatterChart(selectedTrendScatterRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedTrendScatterRows]);

  // 初始化趋势热图 - 当 Tab 切换到趋势热图时初始化
  useEffect(() => {
    if (activeTab === 'trendHeatmap' && trendHeatmapChartRef.current) {
      updateTrendHeatmapChart(selectedTrendHeatmapRows);
      
      // 响应式
      const handleResize = () => updateTrendHeatmapChart(selectedTrendHeatmapRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedTrendHeatmapRows]);

  // 下载处理
  const handleDiffScatterDownload = (selectedRowKeys) => {
    message.success(`正在下载分化散点图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleDiffGridDownload = (selectedRowKeys) => {
    message.success(`正在下载分化网格图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleTrendScatterDownload = (selectedRowKeys) => {
    message.success(`正在下载趋势散点图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleTrendHeatmapDownload = (selectedRowKeys) => {
    message.success(`正在下载趋势热图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleDiffScatterRefresh = () => {
    message.success('已刷新分化散点图数据');
    setSelectedDiffScatterRows(['1', '2', '3', '4', '5']);
  };

  const handleDiffGridRefresh = () => {
    message.success('已刷新分化网格图数据');
    setSelectedDiffGridRows(['1', '2', '3', '4', '5']);
  };

  const handleTrendScatterRefresh = () => {
    message.success('已刷新趋势散点图数据');
    setSelectedTrendScatterRows(['1', '2', '3', '4', '5']);
  };

  const handleTrendHeatmapRefresh = () => {
    message.success('已刷新趋势热图数据');
    setSelectedTrendHeatmapRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'diffScatter',
      label: '分化散点图',
    },
    {
      key: 'diffGrid',
      label: '分化网格图',
    },
    {
      key: 'trendScatter',
      label: '趋势散点图',
    },
    {
      key: 'trendHeatmap',
      label: '趋势热图',
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

      <div style={{ display: activeTab === 'diffScatter' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={diffScatterChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={diffScatterTableColumns}
          tableData={diffScatterTableData}
          selectedRowKeys={selectedDiffScatterRows}
          onSelectChange={setSelectedDiffScatterRows}
          onDownload={handleDiffScatterDownload}
          onRefresh={handleDiffScatterRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'diffGrid' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={diffGridChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={diffGridTableColumns}
          tableData={diffGridTableData}
          selectedRowKeys={selectedDiffGridRows}
          onSelectChange={setSelectedDiffGridRows}
          onDownload={handleDiffGridDownload}
          onRefresh={handleDiffGridRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'trendScatter' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={trendScatterChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={trendScatterTableColumns}
          tableData={trendScatterTableData}
          selectedRowKeys={selectedTrendScatterRows}
          onSelectChange={setSelectedTrendScatterRows}
          onDownload={handleTrendScatterDownload}
          onRefresh={handleTrendScatterRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'trendHeatmap' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={trendHeatmapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={trendHeatmapTableColumns}
          tableData={trendHeatmapTableData}
          selectedRowKeys={selectedTrendHeatmapRows}
          onSelectChange={setSelectedTrendHeatmapRows}
          onDownload={handleTrendHeatmapDownload}
          onRefresh={handleTrendHeatmapRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default PAGAPseudotimeDEG;